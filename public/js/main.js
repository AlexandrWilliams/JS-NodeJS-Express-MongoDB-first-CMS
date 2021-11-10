(function() {
    if($('textarea#ta').length) {
        CKEDITOR.replace(ta);
    }

    $('a.confirmDelete').on('click', () => {
            if (!confirm('Delete this page?')) {
                return false;
            }
        });
} ());