import Gun from 'gun';
import 'gun/sea';

class IPFSDataSync {
  constructor(options = {}) {
    // Cập nhật danh sách peers để tăng khả năng kết nối
    this.defaultPeers = [
      'http://localhost:8765/gun',
      'https://gun-manhattan.herokuapp.com/gun',
      'https://gun-us-west.herokuapp.com/gun', // Thêm peers khác để tăng độ tin cậy
      'https://gun-eu.herokuapp.com/gun'
    ];

    // Khởi tạo Gun với cấu hình nâng cao
    this.gun = Gun({
      peers: options.peers || this.defaultPeers,
      localStorage: true,
      radisk: true,
      multicast: true,
      // Thêm cấu hình WebRTC để hỗ trợ kết nối ngang hàng
      webrtc: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      }
    });
  }

  // Phương thức đồng bộ hóa nâng cao với version control
  async syncWithGun(userId, dbJson, additionalMetadata = {}) {
    try {
      // Kiểm tra và tạo version cho dữ liệu
      const version = additionalMetadata.version || Date.now();
      
      // Pin JSON to IPFS
      const cid = await this.pinJSONToIPFS(dbJson);
      
      // Lưu trữ CID trong Gun với thông tin version
      await this.storeCIDInGun(userId, cid, {
        ...additionalMetadata,
        version,
        syncTimestamp: Date.now()
      });
      
      return { cid, version };
    } catch (error) {
      console.error("Advanced Sync Error:", error);
      throw new Error(`Comprehensive sync failed: ${error.message}`);
    }
  }

  // Phương thức đồng bộ từ Gun với kiểm tra version
  async syncFromGun(userId, options = {}) {
    try {
      // Lấy CID mới nhất
      const latestSync = await this.fetchLatestCIDFromGun(userId);
      
      // Kiểm tra version nếu cần
      if (options.minVersion && latestSync.version < options.minVersion) {
        throw new Error('Local version is too old');
      }
      
      // Lấy dữ liệu JSON từ IPFS
      const dbJson = await this.getFileFromIPFS(latestSync.metadataCid);
      
      return {
        data: dbJson,
        version: latestSync.version
      };
    } catch (error) {
      console.error("Advanced Sync from Gun Failed:", error);
      throw error;
    }
  }

  // Phương thức đăng ký theo dõi thay đổi với quản lý version
  subscribeToVersionedChanges(userId, callback) {
    let lastVersion = 0;

    const subscription = this.gun
      .get(`users/${userId}/sync`)
      .on(async (data, key) => {
        // Chỉ xử lý khi version mới
        if (data && data.version && data.version > lastVersion) {
          try {
            // Lấy dữ liệu chi tiết
            const fullData = await this.getFileFromIPFS(data.metadataCid);
            
            // Gọi callback với dữ liệu đầy đủ
            callback({
              version: data.version,
              data: fullData,
              metadata: data
            });

            // Cập nhật version cuối cùng
            lastVersion = data.version;
          } catch (error) {
            console.error('Error processing versioned data:', error);
          }
        }
      });

    // Trả về hàm hủy đăng ký
    return () => {
      subscription.off();
    };
  }

  // Phương thức hòa giải xung đột (merge conflict)
  async mergeData(localData, remoteData, mergeStrategy = 'latest') {
    switch(mergeStrategy) {
      case 'latest':
        // Chọn dữ liệu mới nhất
        return localData.version > remoteData.version ? localData : remoteData;
      
      case 'combine':
        return {
          ...localData.data,
          ...remoteData.data,
          version: Math.max(localData.version, remoteData.version)
        };
      
      default:
        throw new Error('Unsupported merge strategy');
    }
  }

}

export default IPFSDataSync;