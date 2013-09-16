app = angular.module('PlayersApp', [])

app.config(['$routeProvider', function($routeProvider, $locationProvider) {
  // Configure routes
  $routeProvider.
      when('/players', {templateUrl: 'partials/players-list.html',   controller: 'PlayersListCrtl'}).
      when('/players/:playerId/edit', {templateUrl: 'partials/player-edit.html', controller: 'PlayersEditCtrl'}).
      when('/map/:playerId', {templateUrl: 'partials/map.html', controller: 'MapCtrl'}).
      otherwise({redirectTo: '/players'});
}]);

app.factory('playerFactory', ['$http', '$q', function ($http, $q) {
  return {
    listPlayers: function () {
      var deferred = $q.defer();

      $http.get('/players/list').success(function (data) {
        deferred.resolve(data);
      })

      return deferred.promise;
    },

    newPlayer: function () {
      var deferred = $q.defer();

      $http.get('/players/new').success(function (data) {
        deferred.resolve(data);
      })

      return deferred.promise;
    },

    savePlayer: function(player) {
      var deferred = $q.defer();

      $http({
        method: 'POST',
        url: '/players/save',
        data: player
      }).success(function (data) {
        deferred.resolve(data);
      })

      return deferred.promise;
    },

    deletePlayer: function(player) {
      var deferred = $q.defer();

      $http({
        method: 'POST',
        url: '/players/delete',
        data: {id: player}
      }).success(function (data) {
        console.log('success')
        deferred.resolve(data);
      })

      return deferred.promise;
    }
  };
}]);

app.controller('PlayersListCrtl', ['playerFactory', '$scope', '$location', '$rootScope', function (playerFactory, $scope, $location, $rootScope) {
  $scope.players = []
  $scope.selectedPlayerId = null

  function reload() {
    playerFactory.listPlayers().then(function(players) {
      $scope.players = players
    })
  }

  reload()

  $scope.newPlayer = function() {
    playerFactory.newPlayer().then(function(player) {
      console.log(player)
      $location.path('/players/' + player._id + '/edit')
    })
  }

  $scope.deletePlayer = function(player) {
    playerFactory.deletePlayer(player)
      .then(function(resp) {
        reload()
      })
  }

  $scope.selectPlayer = function() {
    $rootScope.$broadcast('playerSelected', $scope.selectedPlayerId)
  }
}])

app.controller('PlayersEditCtrl', ['playerFactory', '$scope', '$routeParams', '$location', function (playerFactory, $scope, $routeParams, $location) {
  $scope.player_name
  $scope.player_props = []

  playerFactory.listPlayers().then(function(players) {
    player = $.grep(players, function(p) {
      return p.id == $routeParams.playerId
    })[0]
    
    $scope.player_name = player.name
    $scope.player_props = $.map(player, function(v, k) {
      return {
        name: k,
        value: v
      }
    })
  })

  $scope.savePlayer = function() {
    player = {}
    $.each($scope.player_props, function(_, prop) {
      player[prop.name] = prop.value
    })

    playerFactory.savePlayer(player).then(function() {
      $location.path('/players')
    })
  }
}])
