app = angular.module('PlayersApp')

app.factory('mapFactory', ['$http', '$q', function ($http, $q) {
  return {
    getMap: function(playerId) {
      var deferred = $q.defer();

      // $http({
      //   method: 'POST',
      //   url: '/map',
      //   data: {playerId: player}
      // }).success(function (data) {
      //   deferred.resolve(data);
      // })

      deferred.resolve('{"area":[[0,16,198,194,855638214,194],[0,16,198,198,198,194],[0,16,198,194,194,194],[0,16,198,198,198,194],[0,16,16,16,1862402080,16],[4,4,4,4,4,4]],"entities":[{"name":"s15 [C04]","type":"character","x":12,"y":7,"_id":"rdbaWs37I"},{"name":"Stefan [C03]","type":"character","x":11,"y":6,"_id":"r14E4aWf7"},{"name":"sfds [B04]","type":"character","x":12,"y":6,"_id":"rLBoV1aIL"},{"name":"Bambo [B01]","type":"character","x":13,"y":6,"_id":"roGCOv4ey"},{"name":"Hihi2 [B08]","type":"character","x":13,"y":7,"_id":"rudZrc-s-"},{"name":"test4 [A08]","type":"character","x":13,"y":8,"_id":"rINsMqx48"},{"name":"Hal [B05]","type":"character","x":11,"y":7,"_id":"roAmpoLLy"},{"name":"piotrek [A05]","type":"character","x":11,"y":5,"_id":"rIQCpubTQ"},{"name":"Wojtek1 [C02]","type":"character","x":12,"y":5,"_id":"ruLGceEyN"},{"name":"foobar [A07]","type":"character","x":13,"y":5,"_id":"rZyBG4wlx"},{"name":"test2 [B06]","type":"character","x":14,"y":6,"_id":"relKwDtsE"},{"name":"Joseph [B05]","type":"character","x":14,"y":7,"_id":"r40m07LeC"}],"items":[{"name":"Leather armor","x":13,"y":7,"_id":"rxEGFkmSN"},{"name":"Potion of gaseous form","x":11,"y":7,"_id":"r416Cho3b"},{"name":"Leather armor","x":14,"y":6,"_id":"r8N1MokUv"}],"map":"Bad feeling ruins","bx":9,"by":4,"stairsdown":{"x":41,"y":23},"x":12,"y":7,"updates":[{"message":"Pál [B04] [rYUbmsSJS] avoided hitting Bambo [B01] [roGCOv4ey] to respect the PvP ban on level 1"},{"message":"Pál [B04] [rYUbmsSJS] avoided hitting s15 [C04] [rdbaWs37I] to respect the PvP ban on level 1"},{"message":"Pál [B04] [rYUbmsSJS] avoided hitting s15 [C04] [rdbaWs37I] to respect the PvP ban on level 1"},{"message":"Jayson [B04] drinks potion of Large healing potion"},{"message":"Jayson [B04] picked up Dexterity Potion"},{"message":"nw [A04] have gone to \'Bad feeling ruins\' [level 1]"},{"message":"Pál2 [B04] drinks potion of Potion of gaseous form"},{"message":"foobar [A02] [riLe2HYM4] avoided hitting Kamil [B03] [rCu1w-NdA] to respect the PvP ban on level 1"},{"message":"foobar [A02] [riLe2HYM4] avoided hitting Kamil [B03] [rCu1w-NdA] to respect the PvP ban on level 1"},{"message":"asdasd [B03] picked up Potion of gaseous form"},{"message":"Stefan [C03] unequipped Leather armor"},{"message":"Stefan [C03] unwielded Dagger"},{"message":"Justysia [A05] drinks potion of Potion of gaseous form"},{"message":"Jayson [B04] drinks potion of Potion of gaseous form"},{"message":"asdasd [B03] picked up Leather armor"},{"message":"Justysia [A05] equipped Leather armor"},{"message":"Jayson [B04] picked up Potion of gaseous form"},{"message":"Justysia [A05] equipped Leather armor"},{"message":"test [B06] [rxMat4kLO] avoided hitting nw [A04] [rDQRbLTAZ] to respect the PvP ban on level 1"},{"message":"Justysia [A05] equipped Leather armor"},{"message":"sfds [B04] drinks potion of Potion of gaseous form"}]}')

      return deferred.promise;
    }
  };
}]);

app.controller('MapCtrl', ['mapFactory', '$scope', '$routeParams', function (mapFactory, $scope, $routeParams) {
  $scope.playerId = $routeParams.playerId

  mapFactory.getMap($scope.playerId).then(function(m) {
    $scope.map_json = m
  })
}])
