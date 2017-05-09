### 雾霾数据分析平台

#### step1

```bash
npm i
npm run dev
```

#### step2

open bowser at [http://localhost:8888/index/map](http://localhost:8888/index/map)

#### 数据来源
http://datacenter.mep.gov.cn

#### 分析工具
* ECharts
* Ant-Design

#### 部署
可以将 `spider` 文件夹放到远程服务器然后建立一个 `crontab` 定时任务

```bash
> crontab -e
> 00 12 * * * /usr/local/bin/node /dev/spider/index.js 2>&1 # 每天12：00执行
```

#### 效果

1. 全国地图
   ![Map](https://ww2.sinaimg.cn/large/006tKfTcgy1feeeypdt6sj312z0letc0.jpg)
2. 所有城市
   ![City](https://ww2.sinaimg.cn/large/006tKfTcgy1feeexyv2dij312z0lewf3.jpg)
3. 城市折线
   ![Line](https://ww1.sinaimg.cn/large/006tKfTcgy1feeezi6k15j312z0leq4l.jpg)