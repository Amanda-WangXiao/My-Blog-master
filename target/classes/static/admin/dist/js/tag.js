$(function () {
    $("#jqGrid").jqGrid({
        url: '/admin/tags/list',
        datatype: "json",
        colModel: [
            {label: 'id', name: 'tagId', index: 'tagId', width: 50, key: true, hidden: true},
            {label: '标签名称', name: 'tagName', index: 'tagName', width: 240},
            {label: '添加时间', name: 'createTime', index: 'createTime', width: 120}
        ],
        height: 560,
        rowNum: 10,
        rowList: [10, 20, 50],
        styleUI: 'Bootstrap',
        loadtext: '信息读取中...',
        rownumbers: false,
        rownumWidth: 20,
        autowidth: true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader: {
            root: "data.list",
            page: "data.currPage",
            total: "data.totalPage",
            records: "data.totalCount"
        },
        prmNames: {
            page: "page",
            rows: "limit",
            order: "order",
        },
        gridComplete: function () {
            //隐藏grid底部滚动条
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({"overflow-x": "hidden"});
        }
    });
    $(window).resize(function () {
        $("#jqGrid").setGridWidth($(".card-body").width());
    });
});

/**
 * jqGrid重新加载
 */
function reload() {
    var page = $("#jqGrid").jqGrid('getGridParam', 'page');
    $("#jqGrid").jqGrid('setGridParam', {
        page: page
    }).trigger("reloadGrid");
}

function tagAdd() {
    reset();
    $('.modal-title').html('标签添加');
    $('#tagModal').modal('show');
}

//绑定modal上的保存按钮
$('#saveButton').click(function () {
    var tagId = $("#linkId").val();
    var tagName = $("#tagName").val();
    if (!validCN_ENString2_18(tagName)) {
        $('#edit-error-msg').css("display", "block");
        $('#edit-error-msg').html("请输入符合规范的名称！");
        return;
    }
    var params = $("#tagForm").serialize();
    var url = '/admin/tags/save';
    if (tagId != null && tagId > 0) {
        url = '/admin/tags/update';
    }
    $.ajax({
        type: 'POST',//方法类型
        url: url,
        data: params,
        success: function (result) {
            if (result.resultCode == 200 && result.data) {
                $('#tagModal').modal('hide');
                swal("保存成功", {
                    icon: "success",
                });
                reload();
            }
            else {
                $('#tagModal').modal('hide');
                swal("保存失败", {
                    icon: "error",
                });
            }
            ;
        },
        error: function () {
            swal("操作失败", {
                icon: "error",
            });
        }
    });
});

function tagEdit() {
    reset();
    var id = getSelectedRow();
    if (id == null) {
        return;
    }
    reset();
    //请求数据
    $.get("/admin/tags/info/" + id, function (r) {
        if (r.resultCode == 200 && r.data != null) {
            //填充数据至modal
            $("#tagName").val(r.data.tagName);
            //根据原linkType值设置select选择器为选中状态
            // if (r.data.linkType == 1) {
            //     $("#linkType option:eq(1)").prop("selected", 'selected');
            // }
            // if (r.data.linkType == 2) {
            //     $("#linkType option:eq(2)").prop("selected", 'selected');
            // }
        }
    });
    $('.modal-title').html('标签修改');
    $('#tagModal').modal('show');
    $("#tagId").val(id);
}

function deleteTag() {
    var ids = getSelectedRows();
    if (ids == null) {
        return;
    }
    swal({
        title: "确认弹框",
        text: "确认要删除数据吗?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((flag) => {
            if (flag) {
                $.ajax({
                    type: "POST",
                    url: "/admin/tags/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
                    success: function (r) {
                        if (r.resultCode == 200) {
                            swal("删除成功", {
                                icon: "success",
                            });
                            $("#jqGrid").trigger("reloadGrid");
                        } else {
                            swal(r.message, {
                                icon: "error",
                            });
                        }
                    }
                });
            }
        }
    );
}

function reset() {
    $("#tagName").val('');
    $("#tagId").val(0);
    $('#edit-error-msg').css("display", "none");
    // $("#linkType option:first").prop("selected", 'selected');
}