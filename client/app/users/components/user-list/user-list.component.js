(function() {
    'use strict';

  angular.module('app.users').component('userList', {
      bindings: {
          users: '<'
      },
      controller: UserListCtrl,
      controllerAs: 'userListCtrl',
      templateUrl: 'app/users/components/user-list/user-list.component.html'
  });

  function UserListCtrl(UserService,SearchService,NgTableParams,$filter,$scope,usSpinnerService) {

      var userListCtrl = this;

      angular.extend(userListCtrl, {
          deleteUser : deleteUser,
          tableFilters : {search:''},
          refreshUserList : refreshUserList
        });

      $scope.$watch('userListCtrl.tableFilters.search', function () {
        userListCtrl.userTableParams.reload();
      });

      userListCtrl.userTableParams = new NgTableParams(
        {
          sorting: {
            name: 'asc' // initial sorting
          }
        },
        {
          getData: function(params,$defer){
            var data = $filter('userFilter')(userListCtrl.users,userListCtrl.tableFilters.search);

            data = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
            // Re-compute number of lines
            params.total(data.length);
            if (params.total() <= (params.page() - 1) * params.count()) {
              params.page(1);
            }
            return data.slice((params.page() - 1) * params.count(), params.page() * params.count());
          }
        }
      );

      function deleteUser(user){
          usSpinnerService.spin('spinner-table-user');
          UserService.deleteUser(user)
            .then(function(){
              var index = userListCtrl.users.indexOf(user);
              userListCtrl.users.splice(index, 1);
              userListCtrl.userTableParams.reload();
              usSpinnerService.stop('spinner-table-user');
            })
            .catch(function(){
              usSpinnerService.stop('spinner-table-user');
            });
      }

      function refreshUserList(){
        usSpinnerService.spin('spinner-table-user');
        UserService.getUserList(true)
          .then(function(userList){
            userListCtrl.users = userList;
            userListCtrl.userTableParams.reload();
            usSpinnerService.stop('spinner-table-user');
          })
          .catch(function(){
            usSpinnerService.stop('spinner-table-user');
          });
      }

  }

})();
