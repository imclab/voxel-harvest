// Generated by CoffeeScript 1.6.3
(function() {
  var EventEmitter, Harvest, ItemPile,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = (require('events')).EventEmitter;

  ItemPile = require('ItemPile');

  module.exports = function(game, opts) {
    return new Harvest(game, opts);
  };

  module.exports.pluginInfo = {
    loadAfter: ['voxel-mine', 'voxel-registry', 'voxel-carry', 'voxel-inventory-hotbar']
  };

  Harvest = (function(_super) {
    __extends(Harvest, _super);

    function Harvest(game, opts) {
      var _ref, _ref1, _ref2, _ref3;
      this.game = game;
      this.mine = (function() {
        var _ref1;
        if ((_ref = (_ref1 = game.plugins) != null ? _ref1.get('voxel-mine') : void 0) != null) {
          return _ref;
        } else {
          throw 'voxel-harvest requires "voxel-mine" plugin';
        }
      })();
      this.registry = (function() {
        var _ref2;
        if ((_ref1 = (_ref2 = game.plugins) != null ? _ref2.get('voxel-registry') : void 0) != null) {
          return _ref1;
        } else {
          throw 'voxel-harvest requires "voxel-mine" plugin';
        }
      })();
      this.playerInventory = (function() {
        var _ref3, _ref4, _ref5;
        if ((_ref2 = (_ref3 = (_ref4 = game.plugins) != null ? (_ref5 = _ref4.get('voxel-carry')) != null ? _ref5.inventory : void 0 : void 0) != null ? _ref3 : opts.playerInventory) != null) {
          return _ref2;
        } else {
          throw 'voxel-harvest requires "voxel-carry" plugin or "playerInventory" option set to inventory instance';
        }
      })();
      this.hotbar = (_ref3 = game.plugins) != null ? _ref3.get('voxel-inventory-hotbar') : void 0;
      this.enable();
    }

    Harvest.prototype.enable = function() {
      var _this = this;
      return this.mine.on('break', this.onBreak = function(target) {
        var blockName, droppedPile, excess;
        game.setBlock(target.voxel, 0);
        _this.damageToolHeld(1);
        blockName = _this.registry.getBlockName(target.value);
        droppedPile = _this.block2ItemPile(blockName);
        if (droppedPile == null) {
          return;
        }
        excess = _this.playerInventory.give(droppedPile);
        if (excess > 0) {
          return _this.game.setBlock(target.voxel, target.value);
        }
      });
    };

    Harvest.prototype.disable = function() {
      return this.mine.removeListener('break', this.onBreak);
    };

    Harvest.prototype.damageToolHeld = function(n) {
      var maxDamage, props, tool, _base;
      if (n == null) {
        n = 1;
      }
      if (this.hotbar == null) {
        return;
      }
      tool = this.hotbar.held();
      if (tool == null) {
        return;
      }
      props = this.registry.getItemProps(tool.item);
      maxDamage = props.maxDamage;
      if (maxDamage == null) {
        return;
      }
      if ((_base = tool.tags).damage == null) {
        _base.damage = 0;
      }
      tool.tags.damage += 1;
      if (tool.tags.damage >= maxDamage) {
        tool = void 0;
      }
      this.hotbar.inventory.set(this.hotbar.inventoryWindow.selectedIndex, tool);
      return this.hotbar.refresh();
    };

    Harvest.prototype.block2ItemPile = function(blockName) {
      var item, itemPile, _ref;
      item = (_ref = this.registry.getItemProps(blockName)) != null ? _ref.itemDrop : void 0;
      if (item === null) {
        return void 0;
      }
      if (item === void 0) {
        item = blockName;
      }
      itemPile = new ItemPile(item, 1);
      return itemPile;
    };

    return Harvest;

  })(EventEmitter);

}).call(this);
