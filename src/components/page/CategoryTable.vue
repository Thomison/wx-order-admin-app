<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 商品分类
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <!--     工具栏     -->
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-add"
                    class="handle-del mr10"
                    @click="handleAdd"
                >新增分类</el-button>
            </div>
            <!--    表格内容    -->
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="updateTime" label="更新时间"></el-table-column>
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
            <!--    分页  -->
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    :hide-on-single-page="true"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="分类名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 新增弹出框 -->
        <el-dialog title="新增" :visible.sync="addVisible" width="30%">
            <el-form :model="addForm" label-width="70px">
                <el-form-item label="分类名称">
                    <el-input v-model="addForm.name" placeholder="请输入新增分类的名称"></el-input>
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
    name: 'categoryTable',
    data() {
        return {
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            pageTotal: 0,
            form: {},
            addForm: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取分类数据
        getData() {
            this.$axios({
                method: "get",
                url: this.baseUrl + "/category/all",
            }).then(response => {
                console.log(response);
                this.tableData = response.data.data;
                this.pageTotal = 1;
            });
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
                url: this.baseUrl + "/category",
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
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$axios({
                        method: "delete",
                        url: this.baseUrl + "/category/" + this.tableData[index].id,
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
                })
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            let editForm = {};
            editForm.id = this.form.id;
            editForm.name = this.form.name;
            // 发送更新请求
            this.$axios({
                method: "put",
                url: this.baseUrl + "/category",
                data: editForm
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
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    }
};
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
