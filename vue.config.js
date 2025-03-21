module.exports = {
	// 配置路径别名
	configureWebpack: {
		// devServer: {
		// 	disableHostCheck: true
		// }
		devServer: {
		          
				  
				  
				   port: 8082,
				   //  // open: true,
				   //  // 代理
				   // proxy:"http://localhost:8081"
				proxy: {
				    '/api': {
				        target: 'http://localhost:8081',
				        changeOrigin: true,
				        pathRewrite: {'^/api': ''}
				    }
				}
				//     overlay: {
				//       warnings: false,
				//       errors: true
				//     }
				  
				  
				  
		      }
	}
	
}
