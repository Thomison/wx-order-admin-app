<template>
    <div class="">
        <!--        标题      -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 订单管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>


        <!--        内容      -->
        <div class="container">
            <el-table
                :data="orderList.slice((currentPage-1)*pageSize, currentPage*pageSize)"
                border
                class="table"
                empty-text="暂无数据">
<!--                订单商品列表          -->
                <el-table-column label="展开" type="expand">
                    <template v-slot="slot">
                        <el-table :data="slot.row.orderItems">
                            <el-table-column prop="goodName" label="商品名称" align="center"></el-table-column>
                            <el-table-column label="商品图片" align="center">
                                <template slot-scope="scope">
                                    <el-image :src="scope.row.goodImageUrl"></el-image>
                                </template>
                            </el-table-column>
                            <el-table-column prop="cateName" label="商品分类" align="center"></el-table-column>
                            <el-table-column prop="storeName" label="商店名称" align="center"></el-table-column>
                            <el-table-column prop="goodPrice" label="商品价格" align="center"></el-table-column>
                            <el-table-column prop="goodNum" label="商品数量" align="center"></el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
<!--                订单属性            -->
                <el-table-column prop="openId" label="用户openid" align="center"></el-table-column>
                <el-table-column prop="userName" label="用户昵称" align="center"></el-table-column>
                <el-table-column prop="orderNo" label="订单编号" align="center"></el-table-column>
                <el-table-column prop="orderStatus" label="订单状态" align="center">
                    <template slot-scope="{row}">
                        <span> {{orderStatusMap[row.orderStatus]}} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="orderTotalAmount" label="订单总金额" align="center"></el-table-column>
                <el-table-column prop="discountAmount" label="优惠金额" align="center"></el-table-column>
<!--                <el-table-column prop="couponName" label="优惠券名称" align="center">-->
<!--                    <template slot-scope="{row}">-->
<!--                        <span>{{row.couponName || '无'}}</span>-->
<!--                    </template>-->
<!--                </el-table-column>-->
                <el-table-column prop="payTotalAmount" label="支付总金额" align="center"></el-table-column>
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
                <el-form-item label="订单编号">
                    <span>{{editForm.orderNo}}</span>
                </el-form-item>
                <el-form-item label="订单状态">
                    <el-select v-model="editForm.orderStatus" :placeholder="orderStatusOption[editForm.orderStatus].label">
                        <el-option
                            v-for="item in orderStatusOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
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
        name: 'ordersTable',
        data() {
            return {
                // 订单状态映射
                orderStatusMap: {
                    '0': '待付款',
                    '1': '待收货',
                    '2': '已完成'
                },
                orderStatusOption: [
                    {
                        value: 0,
                        label: '待付款'
                    },
                    {
                        value: 1,
                        label: '待收货',
                    },
                    {
                        value: 2,
                        label: '已完成',
                    }
                ],
                // 订单列表
                orderList:[],
                // 用于编辑
                editVisible: false,
                editForm:{
                    orderNo: '',
                    orderStatus:0,
                },
                // 用于分页
                currentPage:1,
                pageSize:5,
                total:0,
            }
        },
        methods: {
            async getData() {
                // 获取所有订单数据
                await this.$axios({
                    method: "get",
                    url: this.baseUrl + "/orders",
                })
                    .then(response => {
                        console.log(response);
                        this.orderList = response.data.data;
                    });
                this.total = this.orderList.length;
            },
            // 编辑操作
            handleEdit(index, row) {
                this.editForm.orderNo = row.orderNo;
                this.editForm.orderStatus = row.orderStatus;
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                // 发送更新请求
                this.$axios({
                    method: "put",
                    url: this.baseUrl + "/order",
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
                            url: this.baseUrl + "/order/" + row.id,
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
                this.pageSize =val;
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
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
    /*el-table-column{*/
    /*    height: 50px;*/
    /*}*/
</style>

