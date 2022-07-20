class ENDPOINT:
    version = "/web"

    # auth
    login = f"{version}/login"
    logout = f"{version}/logout"
    password_recover = f"{version}/password-recover"
    reset_password = f"{version}/password-reset"
    confirm_email = f"{version}/confirm-email"
    resend_confirm_token = f"{version}/resend-email"

    oauth_login = f"{version}/oauth-login"
    auth = f"{version}/auth"
    oauth_logout = f"{version}/oauth-logout"

    # user
    users = f"{version}/users"
    add_user = f"{users}/add"
    edit_user = f"{users}/edit"
    read_user = f"{users}/read"
    deactivate_user = f"{users}/deactivate"
    reactivate_user = f"{users}/reactivate"
    delete_user = f"{users}/delete"

    search_instructor = f"{version}/instructor/search_tutor"
    edit_instructor = f"{version}/instructor/edit"
    read_all_instructors = f"{version}/instructor/all"
    read_all_starred_instructors = f"{version}/instructor/all-starred"
    star_instructor = f"{version}/instructor/star"
    get_instructor_by_tag = f"{version}/instructor/get_instructor_by_tag"

    # post
    posts = f"{version}/posts"
    add_post = f"{posts}/add"
    edit_post = f"{posts}/edit"
    read_post = f"{posts}/read"
    search_post = f"{posts}/search_post"
    delete_post = f"{posts}/delete"
    read_all_posts = f"{posts}/all"
    read_all_saved_posts = f"{posts}/all-saved"
    read_user_posts = f"{posts}/by-user"
    upvote_post = f"{posts}/upvote"
    downvote_post = f"{posts}/downvote"
    save_post = f"{posts}/save"
    get_post_by_tag = f"{posts}/get_post_by_tag"

    # comment
    comments = f"{version}/comments"
    add_comment = f"{comments}/add"
    edit_comment = f"{comments}/edit"
    read_comment = f"{comments}/read"
    delete_comment = f"{comments}/delete"
    read_post_comments = f"{comments}/by-post"
    upvote_comment = f"{comments}/upvote"
    downvote_comment = f"{comments}/downvote"

    # tag
    tags = f"{version}/tags"
    read_all_tags = f"{tags}/all"
    tag_post = f"{tags}/tag-post"
    tag_instructor = f"{tags}/tag_instructor"
