$(document).ready(function () {
    $("#btn").click(function () {
        alert($("input[type=radio]:checked").val());
    });
});
