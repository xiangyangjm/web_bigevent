$(function() {
    // 调用 getUserInfo() 获取用户的基本信息 
    getUserInfo()

    var layer = layui.layer;

    //
    $('#btnLogOut').on('click', function() {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
            // do something
            // 1. 清空本地存储中的token
            localStorage.removeItem('token');
            // 2.重新跳转到登陆页面
            location.href = '/login.html'
                //关闭 confirm 询问框
            layer.close(index);
        })
    })
})

// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        // 以 /my 开头的请求路径，需要在请求头中携带 Authorization 身份认证字段，才能正常访问成功
        // headers 就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户基本信息失败！')
            }
            // 调用 renderAvater() 渲染用户的头像
            renderAvatar(res.data)
        },
        // // 不论成功还是失败，最终都会调用complete回调函数
        // complete: function(res) {
        //     // console.log(res);
        //     // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1. 强制清空 token
        //         localStorage.removeItem('token');
        //         // 2. 强制跳转到登录页面
        //         location.href = '/login.html'
        //     }
        // }
    });
}

// 渲染用户的头像
function renderAvatar(user) {
    // 1.获取用户名称
    var uname = user.nickname || user.username;
    // 2.渲染名称
    $('#welcome').html('欢迎&nbsp;&nbsp;' + uname);
    // 3.按需渲染用户头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 渲染字体图像
        $('.layui-nav-img').hide()
        var firstName = uname[0].toUpperCase()
        $('.text-avatar').html(firstName).show()
    }
}