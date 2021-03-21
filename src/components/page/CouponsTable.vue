<template>
    <div class="">
        <!--        标题      -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 优惠券管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>


        <!--        内容      -->
        <div class="container">

            <!--        工具栏     -->
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-add"
                    class="handle-del mr10"
                    @click="handleAdd"
                >新增优惠券</el-button>
            </div>

            <!--                表格      -->
            <el-table
                :data="couponList.slice((currentPage-1)*pageSize, currentPage*pageSize)"
                border
                class="table"
                empty-text="暂无数据">
                <el-table-column prop="couponName" label="优惠券名称" align="center" fixed="left"></el-table-column>

                <el-table-column prop="couponDesc" label="优惠券介绍" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.couponDesc || '无'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="total" label="优惠券数量" align="center">
                    <template slot-scope="{row}">
                        <span v-if="row.total===0">不限量</span>
                        <span v-else>{{row.total}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="couponMin" label="最少消费金额" align="center"></el-table-column>
                <el-table-column prop="discount" label="优惠金额" align="center"></el-table-column>
                <el-table-column prop="couponLimit" label="用户可以领取的优惠券数量" align="center">
                    <template slot-scope="{row}">
                        <span v-if="row.couponLimit===0">不限量</span>
                        <span v-else>{{row.couponLimit}}</span>
                    </template>
                </el-table-column>

<!--                <el-table-column prop="couponStatus" label="优惠券状态" align="center">-->
<!--                    <template slot-scope="{row}">-->
<!--                        <span> {{statusMap[row.couponStatus]}} </span>-->
<!--                    </template>-->
<!--                </el-table-column>-->

                <el-table-column prop="storeId" label="店铺id" align="center">
                    <template slot-scope="{row}">
                        <span v-if="row.storeId===0"> 任意店铺 </span>
                        <span v-else> {{row.storeId}} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="goodId" label="商品id" align="center">
                    <template slot-scope="{row}">
                        <span v-if="row.goodId===0"> 任意商品 </span>
                        <span v-else> {{row.goodId}} </span>
                    </template>
                </el-table-column>

                <el-table-column prop="seconds" label="有效期" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.seconds}} 秒 </span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>

                <el-table-column label="操作" width="180" align="center" fixed="right">
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
                    :page-sizes="[5, 10]"
                    :total="total">
                </el-pagination>
            </div>
        </div>

        <!--            编辑商品的弹出框        -->
        <el-dialog title="编辑优惠券" :visible.sync="editVisible" width="50%">
            <el-form :model="editForm" label-width="200px">
                <el-form-item label="优惠券名称">
                    <el-input v-model="editForm.couponName"></el-input>
                </el-form-item>
                <el-form-item label="优惠券描述">
                    <el-input type="textarea" v-model="editForm.couponDesc"></el-input>
                </el-form-item>
                <el-form-item label="优惠券数量(0为不限量)">
                    <el-input v-model="editForm.total"></el-input>
                </el-form-item>
                <el-form-item label="最低消费金额">
                    <el-input v-model="editForm.couponMin"></el-input>
                </el-form-item>
                <el-form-item label="优惠金额">
                    <el-input v-model="editForm.discount"></el-input>
                </el-form-item>
                <el-form-item label="优惠券所属店铺">
                    <el-select v-model="editForm.storeId">
                        <el-option
                            v-for="item in goodsTypeOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="优惠券所属商品">
                    <el-input v-model="editForm.goodId"></el-input>
                </el-form-item>
                <el-form-item label="可领取数量(0为不限量)">
                    <el-input v-model="editForm.couponLimit"></el-input>
                </el-form-item>
                <el-form-item label="优惠券有效期(秒为单位)">
                    <el-input v-model="editForm.seconds"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!--            新增商品的弹出框        -->
        <el-dialog title="新增优惠券" :visible.sync="addVisible" width="50%">
            <el-form :model="addForm" label-width="200px">
                <el-form-item label="优惠券名称">
                    <el-input v-model="addForm.couponName" placeholder="请输入优惠券名称"></el-input>
                </el-form-item>
                <el-form-item label="优惠券描述">
                    <el-input type="textarea" v-model="addForm.couponDesc" placeholder="请输入优惠券描述内容"></el-input>
                </el-form-item>
                <el-form-item label="优惠券数量">
                    <el-input v-model="addForm.total" placeholder="请输入优惠券数量(0表示不限量)"></el-input>
                </el-form-item>
                <el-form-item label="最低消费金额">
                    <el-input v-model="addForm.couponMin" placeholder="请输入优惠券要求的最低消费金额"></el-input>
                </el-form-item>
                <el-form-item label="优惠金额">
                    <el-input v-model="addForm.discount" placeholder="请输入优惠券的优惠金额"></el-input>
                </el-form-item>
                <el-form-item label="优惠券所属店铺">
                    <el-select v-model="addForm.storeId" placeholder="请选择优惠券所属店铺">
                        <el-option
                            v-for="item in goodsTypeOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="优惠券所属商品">
                    <el-input v-model="addForm.goodId" placeholder="请输入优惠券所属商品id"></el-input>
                </el-form-item>
                <el-form-item label="用户领取的优惠券数量限制">
                    <el-input v-model="addForm.couponLimit" placeholder="请输入用户领取的优惠券数量限制(0表示不限量)"></el-input>
                </el-form-item>
                <el-form-item label="优惠券有效期">
                    <el-input v-model="addForm.seconds" placeholder="请输入优惠券的有效期(秒为单位)"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import moment from 'moment';
    export default {
        name: 'couponsTable',
        data() {
            return {
                goodsTypeMap: {
                    '1': '店铺A',
                    '2': '店铺B'
                },
                goodsTypeOption: [
                    {
                        value: 1,
                        label: '店铺A'
                    },
                    {
                        value: 2,
                        label: '店铺B',
                    }
                ],
                // 优惠券列表
                couponList:[],
                // 用于编辑
                editVisible: false,
                editForm:{
                    id:0,
                    couponName:'',
                    couponDesc:'',
                    storeId:0,
                    goodId:0,
                    total:0,
                    couponMin:0,
                    discount:0,
                    couponLimit:0,
                    seconds:0,
                },
                // 用于新增
                addVisible: false,
                addForm:{
                    // timeType:0, // 默认基于领取时间开始计算有效期
                },
                // 用于分页
                currentPage:1,
                pageSize:5,
                total:0,
            }
        },
        methods: {
            async getData() {
                // 获取店铺数据
                await this.$axios({
                    method: "get",
                    url: this.baseUrl + "/coupons",
                })
                    .then(response => {
                        // console.log(response);
                        this.couponList = response.data.data;
                    });
                this.total = this.couponList.length;
            },
            // 新增操作
            handleAdd() {
                this.addVisible = true;
            },
            // 保存新增
            saveAdd() {
                this.addVisible = false;
                this.$axios({
                    method: "post",
                    url: this.baseUrl + "/coupon",
                    data: this.addForm
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
            },
            // 编辑操作
            handleEdit(index, row) {
                // console.log(row);
                this.editForm.id = row.id;
                this.editForm.couponName = row.couponName;
                this.editForm.couponDesc = row.couponDesc;
                this.editForm.total = row.total;
                this.editForm.couponMin = row.couponMin;
                this.editForm.discount = row.discount;
                this.editForm.couponLimit = row.couponLimit;
                // this.editForm.couponStatus = row.couponStatus;
                // this.editForm.goodsType = row.goodsType;
                // this.editForm.timeType = row.timeType;
                this.editForm.seconds = row.seconds;
                this.editForm.storeId = row.storeId;
                this.editForm.goodId = row.goodId;
                this.editVisible = true;

            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                // 发送更新请求
                this.$axios({
                    method: "put",
                    url: this.baseUrl + "/coupon",
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
                            url: this.baseUrl + "/coupon/" + row.id,
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
</style>

