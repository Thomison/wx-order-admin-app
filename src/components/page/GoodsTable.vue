<template>
    <div class="">
<!--        标题      -->
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 商品管理</el-breadcrumb-item>
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
                >新增商品</el-button>
            </div>
<!--            标签页         -->
            <el-tabs v-model="activeName" @tab-click="handleClickTab">
<!--                表格      -->
                <el-tab-pane v-for="(item, index) in storeList" :key="item.id" :label="item.name" :name="item.name">
<!--                    {{item.name}}-->
                    <el-table :data="curGoodList.slice((currentPage-1)*pageSize, currentPage*pageSize)" border class="table">
                        <el-table-column prop="goodName" label="商品名称" align="center"></el-table-column>
                        <el-table-column prop="cateName" label="商品类别" align="center"></el-table-column>
                        <el-table-column prop="goodPrice" label="商品价格" align="center"></el-table-column>
                        <el-table-column label="商品图片" align="center">
                            <template slot-scope="scope">
                                <el-image :src="scope.row.goodImageUrl"></el-image>
                            </template>
                        </el-table-column>
                        <el-table-column prop="goodSaleNum" label="商品销量" align="center"></el-table-column>
                        <el-table-column prop="creatTime" label="创建时间" align="center"></el-table-column>
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
                </el-tab-pane>
<!--                分页      -->
                <div class="pagination">
                    <el-pagination
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="10"
                        :page-sizes="[5, 10]"
                        :total="total">
                    </el-pagination>
                </div>
            </el-tabs>
        </div>

<!--            编辑商品的弹出框        -->
        <el-dialog title="编辑商品" :visible.sync="editVisible" width="50%">
            <el-form ref="editForm" :model="editForm" label-width="200px">
                <el-form-item label="所属店铺">
                    <el-select v-model="editForm.storeId" :placeholder="editForm.storeName">
                        <el-option
                            v-for="item in storeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品分类">
                    <el-select v-model="editForm.cateId" :placeholder="editForm.cateName">
                        <el-option
                            v-for="item in cateList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品名称">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="商品图片URL地址">
                    <el-input v-model="editForm.imageUrl"></el-input>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-input v-model="editForm.price"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

<!--            新增商品的弹出框        -->
        <el-dialog title="新增商品" :visible.sync="addVisible" width="50%">
            <el-form :model="addForm" label-width="200px">
                <el-form-item label="所属店铺">
                    <el-select v-model="addForm.storeId" placeholder="请选择商品所属店铺">
                        <el-option
                            v-for="item in storeList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品分类">
                    <el-select v-model="addForm.cateId" placeholder="请选择商品分类">
                        <el-option
                            v-for="item in cateList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品名称">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
                <el-form-item label="商品图片URL地址">
                    <el-input v-model="addForm.imageUrl"></el-input>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-input v-model="addForm.price"></el-input>
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
    export default {
        name: 'goodsTable',
        data() {
            return {
                // 店铺及其商品数据
                storeList:[],
                // 分类数据
                cateList:[],
                // 当前选中店铺的商品数据
                curGoodList:[],
                activeName:'',
                currentTabIndex: 0,
                // 用于编辑
                editVisible: false,
                editForm:{
                    id:-1,
                    name:'',
                    imageUrl:'',
                    price:-1,
                    cateId:-1,
                    cateName:'',
                    storeId:-1,
                    storeName:'',
                },
                // 用于新增
                addVisible: false,
                addForm:{},
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
                    url: this.baseUrl + "/stores",
                })
                    .then(response => {
                    // console.log(response);
                    this.storeList = response.data.data;
                });
                for (let i = 0; i < this.storeList.length; i++) {
                    // 获取商品数据
                    await this.$axios({
                        method: "get",
                        url: this.baseUrl + "/store/" + this.storeList[i].id + "/goods"
                    })
                        .then(response2 => {
                            // console.log(response2);
                            this.storeList[i].goods = response2.data.data;
                        });
                }
                this.setData();
                // 获取分类数据
                await this.$axios({
                    method: "get",
                    url: this.baseUrl + "/category/all"
                })
                    .then(response => {
                        // console.log(response);
                        this.cateList = response.data.data;
                    });
            },
            setData() {
                this.activeName = this.storeList[this.currentTabIndex].name;
                this.curGoodList = this.storeList[this.currentTabIndex].goods;
                this.total = this.curGoodList.length;
            },
            // 用于切换标签页
            handleClickTab(tab, event) {
                // console.log(tab, event);
                this.currentTabIndex = tab.index;
                this.setData();
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
                    url: this.baseUrl + "/good",
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
                this.editForm.id = row.goodId;
                this.editForm.name = row.goodName;
                this.editForm.imageUrl = row.goodImageUrl;
                this.editForm.price = row.goodPrice;
                this.editForm.cateId = row.cateId;
                this.editForm.cateName = row.cateName;
                this.editForm.storeId = row.storeId;
                this.editForm.storeName = row.storeName;
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                // 发送更新请求
                this.$axios({
                    method: "put",
                    url: this.baseUrl + "/good",
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
                            url: this.baseUrl + "/good/" + row.goodId,
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

