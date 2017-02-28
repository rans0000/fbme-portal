/*jshint browser: true*/
/*global angular: true*/
/*global jQuery: true*/

(function(){
    'use strict';

    angular.module('app.core.module', [
        'ui.router',
        'ui.bootstrap',
        'toastr',
        'ngStorage',
        'headerArea.module',
        'ui.bootstrap.contextMenu',
        'login.module',
        'dashboard.module',
        'role.module'
    ])
        .config(httpProviderConfiguration)
        .config(routerConfiguration)
        .config(debugConfiguration)
        .factory('httpRequestInterceptor', httpRequestInterceptor)
        .factory('jQuery', jQueryService);

    httpProviderConfiguration.$inject = ['$httpProvider'];
    function httpProviderConfiguration ($httpProvider) {
        $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        $httpProvider.defaults.paramSerializer = '$httpParamSerializerJQLike';
    }

    routerConfiguration.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider'];
    function routerConfiguration ($stateProvider, $urlRouterProvider, $httpProvider) {
        $urlRouterProvider.otherwise('/login');
        $httpProvider.interceptors.push('httpRequestInterceptor');

        $stateProvider
            .state('login', {
            url: '/login',
            templateUrl: 'js/modules/login/login.template.html',
            controller: 'LoginController',
            controllerAs: 'login'
        })
            .state('root', {
            abstract: true,
            views: {
                '': {
                    templateUrl: 'js/modules/contentArea/contentArea.template.html'
                },
                'headerArea@root': {
                    templateUrl: 'js/modules/headerArea/headerArea.template.html',
                    controller: 'HeaderAreaController',
                    controllerAs: 'header'
                }
            }
        })
            .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'js/modules/dashboard/dashboard.template.html',
            controller: 'DashboardController',
            controllerAs: 'vm'
        });
    }

    httpRequestInterceptor.$inject = ['$q', 'webServiceURL'];
    function httpRequestInterceptor ($q, webServiceURL) {
        var interceptObject = {};
        //interceptObject.request = interceptRequest;
        interceptObject.response = interceptResponseSuccess;
        interceptObject.responseError = interceptResponseError;
        return interceptObject;

        function interceptResponseSuccess (response) {
            var returnValue = response;
            if(response.config.url.startsWith(webServiceURL.apiBase)){
                //response.data.header.responseCode is FD200 for success
                if(response.data.header && response.data.header.responseCode !== 'FD200'){
                    returnValue = $q.reject(response.data);
                }
                else{
                    returnValue = response.data.body? response.data.body : {};
                }
            }
            return returnValue;
        }

        function interceptResponseError (response) {
            var errObj = {
                header: {
                    responseCode: response.status,
                    message: response.statusText,
                    requestUrl: response.config.url
                }
            };
            return $q.reject(errObj);
        }
    }

    function jQueryService () {
        return jQuery;
    }

    debugConfiguration.$inject = ['$compileProvider'];
    function debugConfiguration ($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }

})();
/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('app.core.module')
        .controller('AppController', AppController);

    AppController.$inject = ['utils'];
    function AppController (utils) {
        var vm = this;
        vm.css = utils.getCss();
    }

})();
/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('app.core.module')
        .constant('webServiceURL', getWebServiceURL())
        .constant('permissions', getPermissions());

    function getWebServiceURL () {
        var temp = {
            apiBase: 'http://localhost:8090/FDocs/api/',
            login: 'auth/login.json',
            roleList: 'role/list.json',
            roleDetails: 'role/details.json',
            roleCreate: 'role/create.json',
            roleUpdate: 'role/update.json',
            roledelete: 'role/delete.json'
        };
        return temp;
    }

    function getPermissions () {
        var temp = {
            PERSONAL_DOCS: 1,
            ADMIN: 2,
            COLLABORATION_ADMIN: 4,
            ROLE_MANAGEMENT: 8,
            BRANCH_MANAGEMENT: 16,
            DEPARTMENT_MANAGEMENT: 32,
            SETTINGS_MANAGEMENT: 64,
            USER_MANAGEMENT: 128,
            USER_GROUP_MANAGEMENT: 256
        };
        return temp;
    }

})();
/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('dashboard.module', []);
})();

/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('headerArea.module', []);
})();

/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('login.module', []);
})();

/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('role.module', [])
        .config(routerConfiguration);

    routerConfiguration.$inject = ['$stateProvider'];
    function routerConfiguration ($stateProvider) {
        $stateProvider
            .state('root.role', {
            url: '/role',
            templateUrl: 'js/modules/role/role.template.html',
            controller: 'RoleController',
            controllerAs: 'role'
        });
    }
})();

/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('app.core.module')
        .factory('userService', userService);

    function userService () {
        var userObj = {};
        var currentUserProfile;

        userObj.saveCurrentUserProfile = saveCurrentUserProfile;
        userObj.getAllCurrentUserProfile = getAllCurrentUserProfile;
        userObj.getCurrentUserProfile = getCurrentUserProfile;
        userObj.hasPermission = hasPermission;

        return userObj;

        //--------------------------------------
        //function declarations

        function saveCurrentUserProfile (userProfile) {
            currentUserProfile = angular.copy(userProfile);
            currentUserProfile.privilegeArray = currentUserProfile.privileges.split(',');
            userProfile = null;
        }
        
        function getAllCurrentUserProfile () {
            return angular.copy(currentUserProfile);
        }
        
        function getCurrentUserProfile (property) {
            var value;
            if(currentUserProfile.hasOwnProperty){
                value = currentUserProfile[property];
            }
            else{
                throw {message: 'Missing property in Current user profile'};
            }
            return value;
        }
        
        function hasPermission (permissionString) {
            var isValid = (currentUserProfile.privilegeArray.indexOf(permissionString) === -1)? false: true;
            return isValid;
        }
    }

})();
/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('app.core.module')
        .factory('utils', utilsFactory);

    utilsFactory.$inject = ['$q', '$http', '$localStorage'];
    function utilsFactory ($q, $http, $localStorage) {
        var utilsObj = {};
        var allTranslations;
        utilsObj.getLanguage = getLanguage;
        utilsObj.setLanguage = setLanguage;
        utilsObj.getCss = getCss;
        utilsObj.setCss = setCss;
        utilsObj.getTranslation = getTranslation;
        utilsObj.getLanguagesAvailable = getLanguagesAvailable;
        utilsObj.errorHandler = errorHandler;
        return utilsObj;

        //--------------------------------------
        //function declarations

        function getLanguage () {
            $localStorage.lang = $localStorage.lang || 'en-US';
            return $localStorage.lang;
        }

        function setLanguage (lang) {
            $localStorage.lang = lang;
        }
        
        function getCss () {
            $localStorage.css = $localStorage.css || 'lang-en';
            return $localStorage.css;
        }
        
        function setCss (css) {
            $localStorage.css = css;
        }

        function getTranslation (lang) {
            var temp = allTranslations? $q.resolve(allTranslations) : loadTranslation(lang);
            return temp;
        }
        function loadTranslation (lang) {
            var url = 'data/translations/translations.all-' + lang + '.json';
            return $http.get(url)
                .then(function (response) {
                return response.data.translation;
            })
                .catch(function (error) {
                return $q.reject(error);
            });
        }

        function getLanguagesAvailable () {
            return [
                {name: 'English', langCode: 'en-US', css: 'lang-en', direction: 'ltr'},
                {name: 'العَرَبِيَّة', langCode: 'ar', css: 'lang-ar', direction: 'rtl'}
            ];
        }

        function errorHandler (errorCode) {
            var errStr;
            switch(errorCode){
                case 'FD200': errStr = 'cmcm_Success';break;
                case 'FD207': errStr = 'cmcm_MultipleStatusCodes';break;
                case 'FD400': errStr = 'cmcm_BadRequest';break;
                case 'FD500': errStr = 'cmcm_ServerError';break;
                case 'FD401': errStr = 'cmcm_UnauthorizedAccess';break;
                case 'FD501': errStr = 'cmcm_UnsupportedOperation';break;
                case 'FD412': errStr = 'cmcm_LoginRequired';break;
                case 'FD406': errStr = 'cmcm_InvalidCredentials';break;
                case 'FD101': errStr = 'cmcm_ValidUserNameRequired';break;
                case 'FD102': errStr = 'cmcm_ValidPasswordRequired';break;
                case 'FD103': errStr = 'cmcm_ValidNameRequired';break;
                case 'FD104': errStr = 'cmcm_ValidDescriptionRequired';break;
                case 'FD105': errStr = 'cmcm_ValidIdRequired';break;
                case 'FD106': errStr = 'cmcm_ValidIdsRequired';break;
                case 'FD107': errStr = 'cmcm_ValidPageRequired';break;
                case 'FD108': errStr = 'cmcm_ValidPageSizeRequired';break;
                case 'FD109': errStr = 'cmcm_ValidSortByRequired';break;
                case 'FD110': errStr = 'cmcm_NameNotAvailable';break;
                case 'FD111': errStr = 'cmcm_RoleIsInUse';break;
                case 'FD112': errStr = 'cmcm_RoleNotFound';break;
                case 'FD113': errStr = 'cmcm_CodeNotAvailable';break;
                case 'FD114': errStr = 'cmcm_ValidCodeRequired';break;
                case 'FD115': errStr = 'cmcm_ValidAddress1Required';break;
                case 'FD116': errStr = 'cmcm_ValidAddress2Required';break;
                case 'FD117': errStr = 'cmcm_ValidAddress3Required';break;
                case 'FD118': errStr = 'cmcm_ValidAddress4Required';break;
                case 'FD119': errStr = 'cmcm_ValidZipRequired';break;
                case 'FD120': errStr = 'cmcm_BranchNotFound';break;
                case 'FD121': errStr = 'cmcm_DepartmentNotFound';break;
                case 'FD122': errStr = 'cmcm_ValidFirstNameRequired';break;
                case 'FD123': errStr = 'cmcm_ValidMiddleNameRequired';break;
                case 'FD124': errStr = 'cmcm_ValidLastNameRequired';break;
                case 'FD125': errStr = 'cmcm_ValidEmailRequired';break;
                case 'FD126': errStr = 'cmcm_ValidTimeZoneRequired';break;
                case 'FD127': errStr = 'cmcm_ValidActivationDateRequired';break;
                case 'FD128': errStr = 'cmcm_ValidDateFormatRequired';break;
                case 'FD129': errStr = 'cmcm_UserNameNotAvailable';break;
                case 'FD130': errStr = 'cmcm_EmailIdNotAvailable';break;
                case 'FD131': errStr = 'cmcm_UserNotFound';break;
                default: errStr = 'cmcm_UnknownError';break;
            }
            return errStr;
        }
    }
})();
/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('dashboard.module')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = [];

    function DashboardController () {

        var vm = this;
        vm.status = true;

        //--------------------------------------
        //function declarations
    }
})();

/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('dashboard.module')
        .factory('dashboardService', dashboardService);

    dashboardService.$inject = [];

    function dashboardService () {
        var dashObject = {};
        return dashObject;
    }
})();
/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('headerArea.module')
        .controller('HeaderAreaController', HeaderAreaController);

    HeaderAreaController.$inject = ['headerAreaService'];

    function HeaderAreaController (headerAreaService) {

        var vm = this;
        vm.currentUser = {};
        
        init();

        //--------------------------------------
        //function declarations
        
        function init () {
            vm.currentUser = headerAreaService.populateCurrentUserObj();
        }
    }
})();

/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('headerArea.module')
        .factory('headerAreaService', headerAreaService);

    headerAreaService.$inject = ['userService'];

    function headerAreaService (userService) {
        var headerObj = {};
        headerObj.populateCurrentUserObj = populateCurrentUserObj;
        return headerObj;
        
        //--------------------------------------
        //function declarations
        
        function populateCurrentUserObj () {
            return userService.getAllCurrentUserProfile();
        }
        
    }
})();
/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('login.module')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$state', 'loginService', 'toastr', 'utils', '$scope'];

    function LoginController ($state, loginService, toastr, utils, $scope) {

        var vm = this;
        vm.user ={
            name: '',
            password: ''
        };
        vm.translation = {};
        vm.languagesAvailable = utils.getLanguagesAvailable();
        vm.selectedLanguage = null;

        vm.onLoginSubmit = onLoginSubmit;
        vm.onLanguageChange = onLanguageChange;

        init();

        //--------------------------------------
        //function declarations

        function init () {
            var lang = utils.getLanguage();
            vm.selectedLanguage = vm.languagesAvailable.find(function (item) {
                return item.langCode === lang;
            });
            loadTranslation(lang);
        }

        function loadTranslation (lang) {
            utils.getTranslation(lang)
                .then(onGetTranslationSuccess)
                .catch(onGetTranslationError);
        }

        function onGetTranslationSuccess (response) {
            console.log(response);
            vm.translation = response;
        }

        function onGetTranslationError (error) {
            console.log(error);
            toastr.error(vm.translation.cmcm_TranslationLoadError);
        }

        function onLoginSubmit () {
            var isValid = loginService.validateLoginForm(vm.user);
            if(isValid){
                loginService.requestLogin(vm.user)
                    .then(onLoginSuccess)
                    .catch(onLoginError);
            }
        }

        function onLoginSuccess (response) {
            loginService.saveCurrentUserProfile(response.items[0]);
            $state.go('dashboard');
        }

        function onLoginError (error) {
            var errorTranslation = loginService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Login Error');
        }

        function onLanguageChange () {
            var langCode = vm.selectedLanguage.langCode;
            utils.setLanguage(langCode);
            loadTranslation(langCode);
            $scope.$parent.app.css = vm.selectedLanguage.css;
            utils.setCss(vm.selectedLanguage.css);
        }
    }
})();

/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('login.module')
        .factory('loginService', loginService);

    loginService.$inject = ['$http', 'webServiceURL', 'utils', 'userService'];

    function loginService ($http, webServiceURL, utils, userService) {
        var loginObj = {};
        loginObj.validateLoginForm = validateLoginForm;
        loginObj.requestLogin = requestLogin;
        loginObj.saveCurrentUserProfile = saveCurrentUserProfile;
        loginObj.getErrorTranslationValue = getErrorTranslationValue;

        return loginObj;

        function validateLoginForm (requestObj) {
            var isValid = (requestObj.name.trim() && requestObj.password.trim())? true : false;
            return isValid;
        }

        function requestLogin (requestObj) {
            var obj = {
                userName: requestObj.name,
                Password: requestObj.password
            };
            var url = webServiceURL.apiBase + webServiceURL.login;
            return $http.post(url, obj);
        }

        function saveCurrentUserProfile (userProfile) {
            userService.saveCurrentUserProfile(userProfile);
        }

        function getErrorTranslationValue (errorcode) {
            return utils.errorHandler(errorcode);
        }

    }
})();
/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('role.module')
        .controller('RoleController', RoleController);

    RoleController.$inject = ['roleService', '$uibModal', 'toastr'];

    function RoleController (roleService, $uibModal, toastr) {

        var vm = this;
        vm.roleList = [];
        vm.isExpandedState = true;
        vm.deletePopupData = {};
        vm.updateRolePopupData = getUpdateRolePopupData();
        vm.createRolePopupData = getCreateRolePopupData();
        vm.itemTree = roleService.getSidenavItems();
        vm.selectedFolder = vm.itemTree[0];
        vm.searchOptions = getSearchOptions();
        vm.advSearch = getAdvSearchOptions();
        vm.idList = '';

        vm.onDeleteRoleInitiate = onDeleteRoleInitiate;
        vm.onUpdateRoleInitiate = onUpdateRoleInitiate;
        vm.onCreateRoleInitiate = onCreateRoleInitiate;
        vm.loadRoleData = loadRoleData;

        init();

        //--------------------------------------
        //function declarations

        function init () {
            onAllAPISuccess();
        }

        function onAllAPISuccess () {
            loadRoleList();
        }

        function loadRoleList () {
            roleService.loadRoleList(vm.searchOptions)
                .then(onLoadRoleListSuccess)
                .catch(onLoadRoleListError);
        }

        function onLoadRoleListSuccess (response) {
            //console.log(response);
            vm.roleList = response.items;
            vm.searchOptions.totalItems = response.totalNumPages;
        }

        function onLoadRoleListError (error) {
            //console.log(error);
            var errorTranslation = roleService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Error at listing Role');
        }

        function onDeleteRoleInitiate (roleItem) {
            vm.deletePopupData = getDeletePopupData();
            vm.deletePopupData.successResult = roleItem.id;
            vm.deletePopupData.description = 'Do you want to delete this role (' + roleItem.name + ')?';

            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'js/modules/common/confirmDialog/confirm.dialog.template.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: '$ctrl',
                resolve: {
                    dialogData: function () {
                        return vm.deletePopupData;
                    }
                }
            });

            modalInstance.result.then(deleteRole);
        }

        function getDeletePopupData () {
            var temp = {
                headingText: 'Delete Role',
                confirmText: 'Yes',
                cancelText: 'No',
                description: '',
                successResult: '',
                cancelResult: 'cancel'
            };

            return temp;
        }

        function deleteRole (roleId) {
            var requestObj = {
                ids: [roleId]
            };
            roleService.deleteRole(requestObj)
                .then(onDeleteRoleSuccess)
                .catch(onDeleteRoleError);
        }

        function onDeleteRoleSuccess (response) {
            console.log(response);
            toastr.success('Deleted the role', 'Delete Role');
            //reload role table
            loadRoleList();
        }

        function onDeleteRoleError (error) {
            var errorTranslation = roleService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Error at listing Role');
        }

        function onUpdateRoleInitiate (item) {
            var requestObj = {
                id: item.id
            };
            roleService.loadRoleDetails(requestObj)
                .then(onLoadRoleDetailsSuccess)
                .catch(onLoadRoleDetailsError);
        }

        function onLoadRoleDetailsSuccess (response) {
            vm.updateRolePopupData.item = response.items[0];
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'js/modules/role/create-update/role.create.update.template.html',
                controller: 'RoleUpdateController',
                controllerAs: 'roleDialog',
                size: 'sm',
                resolve: {
                    dialogData: function () {
                        return vm.updateRolePopupData;
                    }
                }
            });

            modalInstance.result.then(onUpdateRoleSuccess);
        }

        function onLoadRoleDetailsError (error) {
            console.log(error);
            var errorTranslation = roleService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Error at loading Role details');
        }

        function onUpdateRoleSuccess () {
            //update tree
            loadRoleList();
        }

        function getUpdateRolePopupData () {
            var temp = {
                headingText: 'Update Role',
                confirmText: 'Update',
                cancelText: 'Cancel',
                description: '',
                successResult: '',
                cancelResult: 'cancel',
                currentPermissions: [],
                item: null,
                mode: 'update',
                translation: null
            };

            return temp;
        }

        function onCreateRoleInitiate () {
            vm.createRolePopupData.item = {
                name: '',
                description: '',
                privileges: ''
            };
            var modalInstance = $uibModal.open({
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'js/modules/role/create-update/role.create.update.template.html',
                controller: 'RoleUpdateController',
                controllerAs: 'roleDialog',
                size: 'sm',
                resolve: {
                    dialogData: function () {
                        return vm.createRolePopupData;
                    }
                }
            });

            modalInstance.result.then(onCreateRoleSuccess);
        }

        function onCreateRoleSuccess () {
            //update tree
            loadRoleList();
        }

        function getCreateRolePopupData () {
            var temp = {
                headingText: 'Create Role',
                confirmText: 'Create',
                cancelText: 'Cancel',
                description: '',
                successResult: '',
                cancelResult: 'cancel',
                currentPermissions: [],
                item: null,
                mode: 'create',
                translation: null
            };

            return temp;
        }

        function loadRoleData () {
            var temp = vm.idList
            .split(/\s*,\s*/)
            .map(function (item) {
                return parseInt(item.trim(), 10);
            })
            .filter(function (item) {
                return !isNaN(item);
            })
            .join(',');
            vm.searchOptions.createdByUserIds = temp || undefined;
            loadRoleList();
        }

        function getSearchOptions () {
            var nowDate = new Date();
            var fromDate = new Date(nowDate);
            fromDate.setFullYear(fromDate.getFullYear() - 1);

            var temp = {
                totalItems: 0,
                page : 1,
                pageSize: 30,
                sortBy: 'name',
                sortOrder: 'A',
                searchText: '',
                createdDateFrom: fromDate,
                createdDateTo: nowDate,
                createdByUserIds: []
            };
            return temp;
        }

        function getAdvSearchOptions () {
            var temp = {
                isOpen: false,
                dateCreatedFromIsOpen: false,
                dateCreatedToIsOpen: false
            };
            return temp;
        }
    }
})();

/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('role.module')
        .factory('roleService', roleService);

    roleService.$inject = ['$http', 'webServiceURL', 'utils', 'permissions'];

    function roleService ($http, webServiceURL, utils, permissions) {
        var roleObject = {};
        roleObject.loadRoleList = loadRoleList;
        roleObject.loadRoleDetails = loadRoleDetails;
        roleObject.createRole = createRole;
        roleObject.updateRole = updateRole;
        roleObject.deleteRole = deleteRole;
        roleObject.getPermissionArray = getPermissionArray;
        roleObject.getSidenavItems = getSidenavItems;
        roleObject.getErrorTranslationValue = getErrorTranslationValue;

        return roleObject;

        //--------------------------------------
        //function declarations

        function loadRoleList (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.roleList;
            return $http.get(url, {params: requestObj});
        }

        function deleteRole (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.roledelete;
            return $http.post(url, requestObj);
        }

        function createRole (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.roleCreate;
            return $http.post(url, requestObj);
        }

        function updateRole (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.roleUpdate;
            return $http.post(url, requestObj);
        }

        function loadRoleDetails (requestObj) {
            var url = webServiceURL.apiBase + webServiceURL.roleDetails;
            return $http.get(url, requestObj);
        }

        function getPermissionArray (privileges) {
            var temp = privileges.split(',');
            var returObj = {
                unselected: {},
                selected: {}
            };
            for(var key in permissions){
                if(temp.indexOf(key) < 0){
                    returObj.selected[key] = false;
                }
                else{
                    returObj.unselected[key] = false;
                }
            }
            return returObj;
        }

        function getSidenavItems () {
            var temp = [
                {
                    title: 'Company Management',
                    type: 'Folder',
                    children: [
                        {
                            title: 'Role Management',
                            type: 'Folder'
                        },
                        {
                            title: 'Branch Management',
                            type: 'Folder'
                        },
                        {
                            title: 'Department Management',
                            type: 'Folder'
                        },
                        {
                            title: 'Settings',
                            type: 'Folder'
                        }
                    ]
                },
                {
                    title: 'User Management',
                    type: 'Folder',
                    children: [
                        {
                            title: 'Public User Group Management',
                            type: 'Folder'
                        }
                    ]
                }
            ];
            return temp;
        }
        
        function getErrorTranslationValue (errorcode) {
            return utils.errorHandler(errorcode);
        }
    }
})();
/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('app.core.module')
        .controller('ModalInstanceCtrl', ModalInstanceCtrl);

    ModalInstanceCtrl.$inject = ['$uibModalInstance', 'dialogData'];

    function ModalInstanceCtrl ($uibModalInstance, dialogData) {
        var vm = this;
        vm.data = dialogData;

        vm.ok = function () {
            $uibModalInstance.close(vm.data.successResult);
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss(vm.data.cancelResult);
        };
    }
})();
/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('app.core.module')
        .directive('branch', branchDirective);

    branchDirective.$inject = ['$compile', 'jQuery'];
    function branchDirective ($compile, $) {
        var directiveObject = {
            replace: true,
            restrict: 'E',
            scope: {
                item: '=',
                selectedFolder: '='
            },
            templateUrl: 'js/modules/common/tree/branch.directive.template.html',
            link: branchLink,
            controller: BranchController,
            controllerAs: 'branch',
            bindToController: true
        };

        BranchController.$inject = ['$scope'];

        return directiveObject;

        function branchLink (scope, element, attributes, ctrl) {
            var $element = $(element);
            
            ctrl.toggleOpenState = toggleOpenState;
            
            if(angular.isArray(scope.branch.item.children)){
                $compile('<tree collection="branch.item.children" selected-folder="tree.selectedFolder"></tree>')(scope, function (cloned) {
                    element.append(cloned);
                });
            }
            
            function toggleOpenState (event) {
                event.stopPropagation();
                ctrl.isOpen = !ctrl.isOpen;
                if(ctrl.isOpen){
                    $element.children('.menu-tree').slideDown();
                }
                else{
                    scope.$emit('folderOpened');
                    $element.children('.menu-tree').slideUp();
                }
            }
        }

        function BranchController ($scope) {
            var vm = this;
            //vm.isActive = false;
            vm.isActive = vm.item === vm.selectedFolder;
            vm.isOpen = false;
            vm.onItemClick = onItemClick;
            vm.hasInnerFolder = checkForInnerFolder();
            //vm.toggleOpenState = toggleOpenState;
            $scope.$on('folderSelectFromExplorer', onFolderSelect);
            $scope.$on('folderOpened', folderOpenedLitener);

            function onItemClick (item) {
                $scope.$emit('folderSelectFromTree', item);
            }

            function onFolderSelect (event, item) {
                if(item === vm.item){
                    vm.isActive = true;
                    vm.isOpen = true;
                    $scope.$emit('folderOpened');
                }
                else{
                    vm.isActive = false;
                }
            }
            
            function folderOpenedLitener () {
                //console.log(vm.item.title);
            }
            
            function checkForInnerFolder () {
                var hasFolder = false;
                angular.forEach(vm.item.children, function (item) {
                    if(item.type === 'Folder'){
                        hasFolder = true;
                    }
                });
                return hasFolder;
            }
        }
    }
})();
/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('app.core')
        .directive('slideToggle', slideToggleDirective);

    slideToggleDirective.$inject = ['jQuery'];
    function slideToggleDirective ($) {
        var directiveObject = {
            restrict: 'A',
            link: slideToggleLink,
        };

        return directiveObject;

        function slideToggleLink (scope, element, attributes, ctrl) {
            var $element = $(element);
            element.on('click', function () {
                if($element.hasClass('active')){
                    $element.siblings('.menu-tree').slideDown();
                }
                else{
                    $element.siblings('.menu-tree').slideUp();
                }
            });
        }
    }
})();
/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('app.core')
        .directive('stopPropagation', stopPropagationDirective);

    function stopPropagationDirective () {
        var directiveObject = {
            replace: true,
            restrict: 'A',
            scope: {
                collection: '='
            },
            link: stopPropagationLink,
            controller: TreeController,
            controllerAs: 'stopPropagation',
            bindToController: true
        };

        return directiveObject;

        function stopPropagationLink (scope, element, attributes, ctrl) {
            element.on('click', function (event) {
                event.stopPropagation();
            });
        }

        function TreeController () {
            var vm = this;
        }
    }
})();
/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';

    angular.module('app.core.module')
        .directive('tree', treeDirective);

    function treeDirective () {
        var directiveObject = {
            replace: true,
            restrict: 'E',
            scope: {
                collection: '=',
                selectedFolder: '='
            },
            templateUrl: 'js/modules/common/tree/tree.directive.template.html',
            link: treeLink,
            controller: TreeController,
            controllerAs: 'tree',
            bindToController: true
        };
        
        return directiveObject;

        function treeLink (scope, element, attributes, ctrl) {
            //console.log(ctrl.collection);
        }
        
        function TreeController () {
            var vm = this;
        }
    }
})();
/*jshint browser: true*/
/*global angular: true*/

(function(){
    'use strict';
    angular.module('app.core.module')
        .controller('RoleUpdateController', RoleUpdateController);

    RoleUpdateController.$inject = ['$uibModalInstance', 'dialogData', 'toastr', 'utils', 'roleService'];

    function RoleUpdateController ($uibModalInstance, dialogData, toastr, utils, roleService) {
        var vm = this;
        vm.activeTab = 0;
        vm.data = dialogData;
        vm.role = {
            name: dialogData.item.name,
            description: dialogData.item.description
        };
        var permissionList = roleService.getPermissionArray(dialogData.item.privileges);
        var mode = dialogData.mode;

        vm.unselectedPermissions = permissionList.selected;
        vm.selectedPermissions = permissionList.unselected;

        vm.validateRoleDetail = validateRoleDetail;
        vm.movePermissions = movePermissions;
        vm.createUpdateRole = createUpdateRole;
        vm.nextTab = nextTab;
        vm.cancel = cancel;

        //--------------------------------------
        //function declarations

        function validateRoleDetail () {
            var isValid =  ((vm.role.name) && (vm.role.description))? true : false;
            return isValid;
        }

        function movePermissions (item1, item2, forceMove) {
            if(!Object.keys(item1).length){
                return;
            }
            for(var key in item1){
                if(item1.hasOwnProperty(key)){
                    if(item1[key] || forceMove){
                        item2[key] = false;
                        delete item1[key];
                    }
                }
            }
        }

        function nextTab () {
            vm.activeTab = 1;
        }
        function cancel () {
            $uibModalInstance.dismiss(vm.data.cancelResult);
        }

        function createUpdateRole () {
            if(mode === 'create'){
                createRole();
            }
            else{
                updateRole();
            }
        }

        function createRole () {
            var privileges = createPermissionString(vm.selectedPermissions);
            var requestObj = {
                name: vm.role.name,
                description: vm.role.description,
                privileges: privileges
            };
            console.log(requestObj);
            roleService.createRole(requestObj)
                .then(onCreateRoleSuccess)
                .catch(onCreateRoleError);
        }

        function onCreateRoleSuccess () {
            $uibModalInstance.close();
            toastr.success('Success', 'Creating Role');
        }

        function onCreateRoleError (error) {
            console.log(error);
            var errorTranslation = roleService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Error in creating Role');
        }

        function updateRole () {
            var privileges = createPermissionString(vm.selectedPermissions);
            var requestObj = {
                id: vm.data.item.id,
                name: vm.role.name,
                description: vm.role.description,
                privileges: privileges
            };
            console.log(requestObj);
            roleService.updateRole(requestObj)
                .then(onUpdateRoleSuccess)
                .catch(onUpdateRoleError);
        }

        function onUpdateRoleSuccess () {
            $uibModalInstance.close();
            toastr.success('Success', 'Updating Role');
        }

        function onUpdateRoleError (error) {
            console.log(error);
            var errorTranslation = roleService.getErrorTranslationValue(error.header.responseCode);
            toastr.error(errorTranslation, 'Error in updating Role');
        }

        function createPermissionString (Obj) {
            var privileges = '';
            var temp = [];
            for(var key in Obj){
                if(Obj.hasOwnProperty(key)){
                    temp.push(key);
                }
            }
            if(temp.length){
                privileges = temp.join(',');
            }
            
            return privileges;
        }
    }
})();