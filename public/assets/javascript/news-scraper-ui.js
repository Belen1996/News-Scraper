function saveArticle(id) {
    if(id) {
        $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            url: "/save-article",
            data: JSON.stringify({
                id: id
            }),
            success: function (data) {
                $("#article-" + id).remove();
            }
        });
    } else {
        // Show error
    }
}

function removeArticle(id) {
    if(id) {
        $.ajax({
            type: "DELETE",
            dataType: "json",
            contentType: "application/json",
            url: "/delete-article",
            data: JSON.stringify({
                id: id
            }),
            success: function (data) {
                $("#article-" + id).remove();
            }
        });
    } else {
        // Show error
    }
}