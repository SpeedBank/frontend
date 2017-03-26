$(function(){
    loadBankAccountsSelect();
    loadBranchesSelect();
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