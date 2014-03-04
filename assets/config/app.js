angular.module('app',[])

.config(function($provide, $compileProvider) {
	$provide.factory('Permissions', function() {
		function Permissions() {
			this.FOO = true;
		}

		var instance = new Permissions();

		return instance;
	});

	$compileProvider.directive('ifHas', function($compile, Permissions) {
		return {
			priority: 1000,
			terminal: true,
			transclude: true,
			compile: function(element, attrs) {
				element.removeAttr('if-has');
				return function(scope, iElement, iAttrs, controller, transcludeFn) {
					isolatedScope = scope.$new();
					isolatedScope.condition = false;
					element.attr('ng-if', 'condition');

					scope.$watch(function() {
						var perm = Permissions[attrs.ifHas];
						isolatedScope.condition = perm;
					});

					transcludeFn(scope, function(cloneElem) {
						iElement.append(cloneElem);
						$compile(iElement)(isolatedScope);
					});
				}
			}
		}
	});
})

.run(function($rootScope, $injector) {
	$rootScope.Permissions = $injector.get('Permissions');
	$rootScope.poo = {};
})

;
angular.element(document).ready(function() {
	angular.bootstrap(document, ['app']);
});
