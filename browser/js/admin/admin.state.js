'use strict'

app.config(function ($stateProvider) {
    $stateProvider
        .state('admin-panel', {
            url: '/admin-panel',
            templateUrl: 'js/admin/admin-panel.html',
            controller: 'adminPanelCtrl',
            resolve: {
                users: function(AdminFactory) {
                    return AdminFactory.getAllUsers()
                },
                orders: function(AdminFactory) {
                    return AdminFactory.getAllOrders();
                }
            }
        });


});