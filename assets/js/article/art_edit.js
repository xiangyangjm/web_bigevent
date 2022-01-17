$(function() {

    var layer = layui.layer
    var form = layui.form

    initCate();
    // 初始化富文本编辑器
    initEditor();

    // 通过代理的形式为 btn-edit 按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function(e) {
        console.log(e);
        var id = $(this).attr('data-id');
        // 发起请求获取对应分类的数据
        $.ajax({
            type: "GET",
            url: "/my/article/" + id,
            success: function(res) {
                console.log(res.data);
                // form.val('form-edit', res.data)
            }
        });
    });
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            success: function(res) {

                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr);
                // 一定要记得调用 form.render() 方法
                form.render()
            }
        });
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function(e) {
        e.preventDefault();
        $('#coverFile').click()
    });

    // 监听 coverFile 的 change 事件，获取用户的选择文件列表
    $('#coverFile').on('change', function(e) {
        // 获取到文件的列表数据
        var files = e.target.files;
        // 判断用户是否选择了 文件
        if (files.length === 0) {
            return
        }
        //根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区 重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    // 定义文章的发布状态
    var art_state = '已发布';

    // 为存为草稿按钮绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    $('#form-pub').on('submit', function(e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault();
        // 2. 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0]);
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state);
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                    // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！');
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        });
    }
})



// $(function() {
//     //根据id获取文章信息
//     // 12、根据id获取文章信息
//     // 请求地址：/admin/article / search
//     // 请求方式：get
//     //1.获取artile_list页面传递过来的文章id
//     let id = itcast.getParameter(location.search).id
//         // console.log(id);
//     $.ajax({
//             url: allSite.article_search,
//             data: { id },
//             dataType: 'json',
//             success: function(res) {
//                 // console.log(res);
//                 if (res.code == 200) {
//                     $('#inputTitle').val(res.data.title)
//                     $('.article_cover').attr('src', res.data.cover)
//                     setTimeout(function() {
//                         $('select.category').val(res.data.categoryId)
//                     }, 0)
//                     $('#testico').val(res.data.date)
//                     $('#mytextarea').val(res.data.content)
//                 }
//             }
//         })
//         // 13、文章编辑
//         // 请求地址：/admin/article / edit
//         // 请求方式：post
//     $('.btn-edit').on('click', function(e) {
//         //阻止默认行为
//         e.preventDefault()
//         uploadingData('已发布')
//     })
//     $('.btn-draft').on('click', function(e) {
//         //阻止默认行为
//         e.preventDefault()
//         uploadingData('草稿')
//     })

//     function uploadingData(state) {
//         //创建FormData
//         let formdata = new FormData($('#form')[0])
//             //tinymce.activeEditor.getContent()获取富文本框的文本内容  获取的数据是以 HTML格式显示
//         formdata.append('content', tinymce.activeEditor.getContent())
//             //追加文章状态
//         formdata.append('state', state)
//             //追加id
//         formdata.append('id', id)
//             // console.log(...formdata);
//             //实现文章发布
//         $.ajax({
//             type: 'post',
//             url: allSite.article_edit,
//             data: formdata,
//             dataType: 'json',
//             contentType: false,
//             processData: false,
//             success: function(res) {
//                 console.log(res);
//                 if (res.code == 200) {
//                     alert('修改成功')
//                         //返回文章列表页 ,给左侧列表页导航栏项添加样式
//                     $('.level02>li:eq(0)', window.parent.document).addClass('active').siblings().removeClass('active');
//                     window.location.href = './article_list.html'
//                 }
//             }
//         })
//     }
//     /*2.文件预览 */
//     //1.给file表单元素注册onchange事件
//     $('#inputCover').change(function() {
//         //1.2 获取用户选择的图片
//         var file = $('#inputCover')[0].files[0];
//         //1.3 将文件转为src路径
//         var url = window.URL.createObjectURL(file);
//         //1.4 将url路径赋值给img标签的src
//         $('.article_cover').attr('src', url);
//     });
// })