function saveArticle(headline, description, original_article) {
    if(headline && description && original_article) {
        $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            url: "/save-article",
            data: JSON.stringify({
                headline: headline,
                description: description,
                original_article: original_article
            }),
            success: function (data) {
                // Show confirmation
            }
        });
    } else {
        // Show error
    }
}

function removeArticle(headline, description, original_article) {
    if(headline && description && original_article) {
        $.ajax({
            type: "DELETE",
            dataType: "json",
            contentType: "application/json",
            url: "/delete-article",
            data: JSON.stringify({
                headline: headline,
                description: description,
                original_article: original_article
            }),
            success: function (data) {
                // Show confirmation
            }
        });
    } else {
        // Show error
    }
}