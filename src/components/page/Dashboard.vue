<template>
    <div>
        <div class="admin-info">
            <el-col :span="6">
                <el-row :gutter="20">
                    <el-card shadow="hover" class="mgb20" style="height:252px;">
                        <div class="user-info">
                            <img src="../../assets/img/img.jpg" class="user-avator" alt />
                            <div class="user-info-cont">
                                <div class="user-info-name">{{name}}</div>
                                <div>管理员</div>
                            </div>
                        </div>
                        <div class="user-info-list">
                            <span style="font-size: large; color: #000">微信点餐小程序的后台管理平台</span>
                        </div>
                    </el-card>
                </el-row>
            </el-col>
        </div>
        <el-col>
            <el-row :gutter="20">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{userNum}}</div>
                                    <div>用户数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>

                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{goodNum}}</div>
                                    <div>商品数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>

                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{orderNum}}</div>
                                    <div>订单数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-row>

        </el-col>

    </div>
</template>

<script>
    export default {
        name: 'dashboard',
        data() {
            return {
                name: localStorage.getItem('admin_name'),
                userNum: 0,
                goodNum: 0,
                orderNum: 0
            };
        },
        components: {
        },
        computed: {
            // role() {
            //     return this.name === 'admin' ? '超级管理员' : '普通用户';
            // }
        },

        methods: {
            changeDate() {
                const now = new Date().getTime();
                this.data.forEach((item, index) => {
                    const date = new Date(now - (6 - index) * 86400000);
                    item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
                });
            },
            async getData() {
                // 获取用户数量
                await this.$axios({
                    method: "get",
                    url: this.baseUrl + "/user/count",
                })
                    .then(response => {
                        console.log(response);
                        this.userNum = response.data.data;
                    });
                // 获取商品数量
                await this.$axios({
                    method: "get",
                    url: this.baseUrl + "/good/count",
                })
                    .then(response => {
                        console.log(response);
                        this.goodNum = response.data.data;
                    });
                // 获取订单数量
                await this.$axios({
                    method: "get",
                    url: this.baseUrl + "/order/count",
                })
                    .then(response => {
                        console.log(response);
                        this.orderNum = response.data.data;
                    });
            }
        },

        created() {
            this.getData();
        }
    };
</script>


<style scoped>
    .admin-info{
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

</style>

