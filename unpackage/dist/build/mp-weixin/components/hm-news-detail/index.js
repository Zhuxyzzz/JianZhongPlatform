(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/hm-news-detail/index"],{"6b62":function(t,e,n){"use strict";n.r(e);var a=n("d567"),i=n("817b");for(var u in i)"default"!==u&&function(t){n.d(e,t,(function(){return i[t]}))}(u);n("af6c");var r,c=n("f0c5"),o=Object(c["a"])(i["default"],a["b"],a["c"],!1,null,null,null,!1,a["a"],r);e["default"]=o.exports},"817b":function(t,e,n){"use strict";n.r(e);var a=n("d8a2"),i=n.n(a);for(var u in a)"default"!==u&&function(t){n.d(e,t,(function(){return a[t]}))}(u);e["default"]=i.a},af6c:function(t,e,n){"use strict";var a=n("de8e"),i=n.n(a);i.a},d567:function(t,e,n){"use strict";var a;n.d(e,"b",(function(){return i})),n.d(e,"c",(function(){return u})),n.d(e,"a",(function(){return a}));var i=function(){var t=this,e=t.$createElement;t._self._c},u=[]},d8a2:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a={name:"HmNewsDetail",filters:{formateDate:function(t){var e=new Date(t),n=e.getFullYear(),a=e.getMonth()+1,i=(a.INT,e.getDate().toString().padStart(2,0));return n+"年-"+a+"月-"+i+"日"}},props:{dataId:{type:String,default:"hm-news-detail"},options:{type:Object,default:function(){return{yunshu:"/static/hm-news-detail/images/img_22946_0_0.png",author:"毫末科技",like:"/static/hm-news-detail/images/img_22946_0_1.png",share:"/static/hm-news-detail/images/img_22946_0_2.png",time:"2 minutes ago",title:"如何用 Python 在笔记本上分析100GB 数据",img:"/static/hm-news-detail/images/img_22946_0_3.png",content:"第 1 种是对数据进行子抽样，但它有一个明显缺点：可能因忽略部分数据而错失关键信息，甚至误解数据表达的含义。第 2 种是使用分布式计算。虽然在某些情况下这是一种有效的方法，但是管理和维护集群会带来巨大开销。想象一下，要为一个刚超出内存大小、大概 30-50GB 的数据集就建立一套集群，对我来说，这似乎有点“用力过猛”。"}}}},data:function(){return{}},methods:{}};e.default=a},de8e:function(t,e,n){}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/hm-news-detail/index-create-component',
    {
        'components/hm-news-detail/index-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("6b62"))
        })
    },
    [['components/hm-news-detail/index-create-component']]
]);
