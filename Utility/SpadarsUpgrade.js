var upgradeMaxLevel = 8; //Max level it will stop upgrading items at if enabled
var stopAfterSuccess = false;
var itemToBuy = "pants";

//show_json(character.items);

var upgradeWhitelist = 
	{
		//ItemName: Max Level
		ecape: upgradeMaxLevel-1,
		eslippers: upgradeMaxLevel,
		eears: upgradeMaxLevel,
		epyjamas: upgradeMaxLevel,
		ebunnyears: upgradeMaxLevel,
		carrotsword: upgradeMaxLevel,
		wingedboots:6,
		gloves: 8,
		coat: 8,
		helmet: 9,
		pants: 8,
	};

let upgrader = setInterval(function() {
	if(parent != null && parent.socket != null){
		upgrade();
	}

}, 75);

function upgrade() {
	for (let i = 0; i < character.items.length; i++){
		let c = character.items[i];

		if (!c) continue
	
		var level = upgradeWhitelist[c.name];
		if(!level) continue;
		if(level && c.level >= level){
			if(stopAfterSuccess){
				clearInterval(upgrader);
				return;
			}
			continue;
		}

		let grades = get_grade(c);
		let scrollname;
			
		if (c.level < grades[0]) scrollname = 'scroll0';
		else if (c.level < grades[1]) scrollname = 'scroll1';
		else scrollname = 'scroll2';
		if(c.name == "epyjamas") scrollname = 'scroll1';
		
		
		let [scroll_slot, scroll] = find_item(i => i.name == scrollname);
		if (!scroll) {
			parent.buy(scrollname);
			return;
		}
		
		if (character.items[scroll_slot].q < 10) parent.buy(scrollname, 10)
				
		parent.socket.emit('upgrade', {
			item_num: i,
			scroll_num: scroll_slot,
			offering_num: null,
			clevel: c.level
		});
			
		return;
  	}
	
	if(itemToBuy == null) return;
	for(let i=0; i<15; i++){
		buy(itemToBuy);
	}
}

function get_grade(item) {
  return parent.G.items[item.name].grades;
}

// Returns the item slot and the item given the slot to start from and a filter.
function find_item(filter) {
  for (let i = 0; i < character.items.length; i++) {
    let item = character.items[i];

    if (item && filter(item))
      return [i, character.items[i]];
  }

  return [-1, null];
}
