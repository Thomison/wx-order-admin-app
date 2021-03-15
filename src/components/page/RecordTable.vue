<template>
    <div class="container">
        <!--        标题      -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 访问记录 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!--        内容      -->
        <div class="container">
            <el-table
                :data="recordList.slice((currentPage-1)*pageSize, currentPage*pageSize)"
                border
                class="table"
                empty-text="暂无数据">

                <el-table-column prop="userOpenId" label="用户openid" align="center"></el-table-column>
                <el-table-column prop="userNickName" label="用户昵称" align="center"></el-table-column>
                <el-table-column label="用户头像" align="center">
                    <template slot-scope="scope">
                        <el-image :src="scope.row.userAvatarUrl"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="storeName" label="店铺名称" align="center"></el-table-column>
                <el-table-column prop="goodName" label="商品名称" align="center"></el-table-column>
                <el-table-column label="商品图片" align="center">
                    <template slot-scope="scope">
                        <el-image :src="scope.row.goodImageUrl"></el-image>
                    </template>
                </el-table-column>

                <el-table-column prop="startTime" label="访问开始时间" align="center"></el-table-column>
                <el-table-column prop="endTime" label="访问结束时间" align="center"></el-table-column>
                <el-table-column prop="duration" label="访问持续时间(秒)" align="center"></el-table-column>


            </el-table>
            <!--                分页      -->
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="10"
                    :page-sizes="[10,20]"
                    :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "recordTable",
        data() {
            return {
                recordList:[],
                // 用于分页
                currentPage:1,
                pageSize:5,
                total:0,
            }
        },
        methods: {
            async getData() {
                // 获取所有用户数据
                await this.$axios({
                    method: "get",
                    url: this.baseUrl + "/records",
                })
                    .then(response => {
                        console.log(response);
                        this.recordList = response.data.data;
                    });
                this.total = this.recordList.length;
            },
            // 分页操作
            handleSizeChange(val) {
                this.pageSize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
        },
        created() {
            // 获取数据
            this.getData();
        }
    }
</script>

<style scoped>
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
</style>
