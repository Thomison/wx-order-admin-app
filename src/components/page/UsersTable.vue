<template xmlns="http://www.w3.org/1999/html">
    <div class="container">
        <!--        标题      -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>


        <!--        内容      -->
        <div class="container">
            <el-table
                :data="userList.slice((currentPage-1)*pageSize, currentPage*pageSize)"
                border
                class="table"
                empty-text="暂无数据">
                <el-table-column prop="openId" label="用户openid" align="center"></el-table-column>
                <el-table-column prop="nickName" label="用户昵称" align="center"></el-table-column>
                <el-table-column label="用户头像" align="center">
                    <template slot-scope="scope">
                        <el-image :src="scope.row.avatar_url"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="用户性别" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.gender === 0">女</span>
                        <span v-else-if="scope.row.gender === 1">男</span>
                        <span v-else>不详</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否价格混淆" align="center">
                    <template slot-scope="{row}">
                        <span v-if="row.confuse">是</span>
                        <span v-else>否</span>
                    </template>
                </el-table-column>
                <el-table-column label="用户余额" align="center">
                    <template slot-scope="{row}">
                        <span style="color: red">￥{{row.money}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="country" label="国家" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.country || '不详'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="province" label="省份" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.province || '不详'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="city" label="城市" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.city || '不详'}}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="lastVisitTime" label="最后一次登录时间" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--                分页      -->
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="5"
                    :page-sizes="[5,10]"
                    :total="total">
                </el-pagination>
            </div>
        </div>

        <!--            编辑商品的弹出框        -->
        <el-dialog title="编辑订单" :visible.sync="editVisible" width="50%">
            <el-form ref="editForm" :model="editForm" label-width="200px">
                <el-form-item label="用户openid">
                    <span>{{editForm.openId}}</span>
                </el-form-item>
                <el-form-item label="用户昵称">
                    <span>{{editForm.nickName}}</span>
                </el-form-item>
<!--               是否采用价格混淆策略       -->
                <el-form-item label="是否采用价格混淆策略">
                    <el-select v-model="editForm.confuse">
                        <el-option
                            v-for="item in confuseOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
<!--                设置用户余额      -->
                <el-form-item label="用户余额">
                    <el-input v-model="editForm.money"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: 'usersTable',
        data() {
            return {
                // 是否混淆
                confuseOption:[
                    {
                        value: true,
                        label: '是'
                    },
                    {
                        value: false,
                        label: '否'
                    }
                ],
                // 用户列表
                userList:[],
                // 用于编辑
                editVisible: false,
                editForm:{
                    openId: '',
                    nickName: '',
                    confuse: true,
                    money: 0,
                },
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
                    url: this.baseUrl + "/users",
                })
                    .then(response => {
                        console.log(response);
                        this.userList = response.data.data;
                    });
                this.total = this.userList.length;
            },
            // 编辑操作
            handleEdit(index, row) {
                this.editForm.openId = row.openId;
                this.editForm.nickName = row.nickName;
                this.editForm.confuse = row.confuse;
                this.editForm.money = row.money;
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                // 发送更新请求
                this.$axios({
                    method: "put",
                    url: this.baseUrl + "/user",
                    data: this.editForm
                }).then(response => {
                    console.log(response);
                    if (response.data.code === 200) {
                        this.$alert(response.data.message);
                        // 重新发送请求 获取列表数据
                        this.getData();
                    } else {
                        this.$alert(response.data.message);
                    }
                });
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.$axios({
                            method: "delete",
                            url: this.baseUrl + "/user/" + row.id,
                        }).then(response => {
                            console.log(response);
                            if (response.data.code === 200) {
                                this.$alert(response.data.message);
                                // 刷新页面数据
                                this.getData();
                            } else {
                                this.$alert(response.data.message);
                            }
                        });
                    });
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
    /*.handle-box {*/
    /*    margin-bottom: 20px;*/
    /*}*/

    /*.handle-select {*/
    /*    width: 120px;*/
    /*}*/

    /*.handle-input {*/
    /*    width: 300px;*/
    /*    display: inline-block;*/
    /*}*/
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    /*.mr10 {*/
    /*    margin-right: 10px;*/
    /*}*/
    /*.table-td-thumb {*/
    /*    display: block;*/
    /*    margin: auto;*/
    /*    width: 40px;*/
    /*    height: 40px;*/
    /*}*/
</style>

