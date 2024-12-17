SELECT
    Post.title_en,
    User.user_name task.FROM Post
    JOIN User ON Post.created_by = User.uid;

SELECT
    User.user_name,
    task.title,
    Post.title_en
FROM
    User
    JOIN task ON task.assignee = User.uid
    JOIN Post on task.parent_id = Post.id;

