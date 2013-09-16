var symbols = [
  { val: 0x00000000, name: "NOTHING"     , symbol: 'NO' },
  { val: 0x00000001, name: "BLOCKED"     , symbol: 'BL' },
  { val: 0x00000002, name: "ROOM"        , symbol: 'RO' },
  { val: 0x00000004, name: "CORRIDOR"    , symbol: 'CO' },
  { val: 0x00000010, name: "PERIMETER"   , symbol: 'PE' },
  { val: 0x00000020, name: "ENTRANCE"    , symbol: 'EN' },
  { val: 0x0000FFC0, name: "ROOM_ID"     , symbol: 'RO' },
  { val: 0x00010000, name: "ARCH"        , symbol: 'AR' },
  { val: 0x00020000, name: "DOOR"        , symbol: 'DO' },
  { val: 0x00040000, name: "DOOR"        , symbol: 'DO' },
  { val: 0x00080000, name: "DOOR"        , symbol: 'DO' },
  { val: 0x00100000, name: "DOOR"        , symbol: 'DO' },
  { val: 0x00200000, name: "PORTCULLIS"  , symbol: 'PO' },
  { val: 0x00400000, name: "STAIR_DOWN"  , symbol: 'SU' },
  { val: 0x00800000, name: "STAIR_UP"    , symbol: 'SD' },
  { val: 0xFF000000, name: "LABEL"       , symbol: 'LA' },
]

app = angular.module('PlayersApp')

app.factory('mapFactory', ['$http', '$q', function ($http, $q) {
  return {
    getMap: function(playerId) {
      var deferred = $q.defer();

      $http({
        method: 'POST',
        url: '/map',
        data: {playerId: playerId}
      }).success(function (data) {
        deferred.resolve(data);
      })

      return deferred.promise;
    }
  };
}]);

app.controller('MapCtrl', ['mapFactory', '$scope', '$routeParams', function (mapFactory, $scope, $routeParams) {
  $scope.$on('playerSelected', function(event, data) {
    console.warn(data)
    mapFactory.getMap($scope.playerId).then(function(m) {
      $scope.area = m.area
      $scope.x = m.x
      $scope.y = m.y
      $scope.bx = m.bx
      $scope.by = m.by
    })
  })

  $scope.getClass = function(cell) {
    if(cell == 0 || cell % 2) {
      return "blocked"
    }
    return "free"
  }

  $scope.getSymbol = function(cell) {
    xd = $.grep(symbols, function(s) {
      return s.val == cell
    })

    if (xd.length == 0) {
      console.log("Not found:" + cell)
      return "  "
    }
    return xd[0].symbol
  }
}])

