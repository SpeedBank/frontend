$(function(){
    loadBankAccountsSelect();
    loadBranchesSelect();
    loadOrderTypesSelect();
    $('#make_request').click(function (e) {
        e.preventDefault();
        var requirements = $('#requirements').val();
        var branch_id = parseInt($('#branches').val());
        var order_type = parseInt($('#order_types').val());
        var bank_id = parseInt($('#bank_accounts').val());
        query = `mutation{createOrder(input:{data:{message:"${requirements}",orderTypeId:${order_type},bankAccountId:${bank_id},branchId:${branch_id}}}){order{id,originalId,message}}}`;

        var promise = new Promise(function(resolve, reject) {
              app.post(query, function (result) {
                    resolve(result);
                })
          });
        promise.then(function (result) {
            $('#requirements').val("");
            $('#branches').val("");
            $('#order_types').val("");
            $('#bank_accounts').val("")
            toastr.info("Request successfully sent");
        });
    });
});

function loadBankAccountsSelect() {
    app.getBankAccounts().then(function (result) {
        var select_options = "<option selected disabled>Bank Account</option>";
        result.forEach(function (account) {
            select_options += `<option value='${account.node.originalId}'>${account.node.name}(${account.node.number})</option>`;
        });
        $("#bank_accounts").html(select_options);
    });
    
}

function loadBranchesSelect() {
    app.getBranches().then(function (result) {
        var select_options = "<option selected disabled>Bank Branches</option>";
        result.forEach(function (branch) {
            select_options += `<option value='${branch.node.originalId}'>${branch.node.name}(${branch.node.bank.name})</option>`;
        });
        $("#branches").html(select_options);
    });
    
}

function loadOrderTypesSelect() {
    app.getOrderTypes().then(function (result) {
        var select_options = "<option selected disabled>Request type</option>";
        app.orderType = result;
        result.forEach(function (res) {
            select_options += `<option value='${res.node.originalId}' requirements='${res.node.requirements}'>${res.node.title}(${res.node.price})</option>`;
        });
        $("#order_types").html(select_options);
    });

}
