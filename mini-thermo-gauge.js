console.info(`%c MINI-THERMO-GAUGE \n%c         v0.2-beta `, 'color: orange; font-weight: bold; background: black', 'color: white; font-weight: bold; background: dimgray');
class MiniThermoGauge extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  setConfig(config) {
    if (!config.entity) {
      throw new Error('Please define an entity');
    }
	if (config.temp_max == null) {
		throw new Error('Please define the temp_max config option');
	}
	if (config.temp_min == null) {
		throw new Error('Please define the temp_min config option');
	}
	
    const root = this.shadowRoot;
    if (root.lastChild) root.removeChild(root.lastChild);

    const cardConfig = Object.assign({}, config);
    if (!cardConfig.scale) cardConfig.scale = "1";

    
    const entityParts = this._splitEntityAndAttribute(cardConfig.entity);
    cardConfig.entity = entityParts.entity;
    if (entityParts.attribute) cardConfig.attribute = entityParts.attribute;

    
    if (config.icon_color !== undefined) {
        var icon_color = config.icon_color;
    } else {
        var icon_color = "var(--paper-item-icon-color)";
    }
	    
    const card = document.createElement('ha-card');
    const content = document.createElement('div');
    const style = document.createElement('style');

    style.textContent = `
		ha-card {
		  --base-unit: ${cardConfig.scale};
		  height: calc(var(--base-unit)*160px);
		  position: relative;
		}
		.container{
		  width: calc(var(--base-unit) * 200px);
		  height: calc(var(--base-unit) * 160px);
		  position: absolute;
		  top: 0px;
		  left: 50%;
		  overflow: hidden;
		  text-align: center;
		  transform: translate(-50%, 0%);
		}	  
	  
		#HandTemperature, #ArrowTargetTemperature, #ClipTemperature, #HandPosition, #ClipPosition{
		  transition-duration: 2s;
		}

		#HandTemperature, #ArrowTargetTemperature, #ClipTemperature{
		  transform-origin: 80px 80px;
		}
		#HandPosition, #ClipPosition{
		  transform-origin: 120px 80px;
		}

		.text{
		  font-style:normal;
		  font-weight:normal;
		  line-height:1.25;
		  font-family:sans-serif;
		  text-align:center;
		  text-anchor:middle;
		  fill: var(--primary-text-color);
		  fill-opacity:1;
		  stroke:none;
		}

		.mode{
		  display:none;
		  fill:none;
		  stroke:var(--primary-text-color);
		  stroke-width:1px;
		  stroke-linecap:butt;
		  stroke-linejoin:miter;
		  stroke-opacity:1;
		}	
		
    `;
	
    content.innerHTML = `
    <div class="container">
		<div class="mini-gauge-card">
		
<svg
   viewBox="0 0 200 160"
   version="1.1"
   id="mini-thermo-gauge"
  <g
     id="Texts">
    <text class="text"
       style="font-size:19px;font-weight:bold;"
       x="50"
       y="105"
       id="TextTemperature">20°C</text>
    <text class="text"
       style="font-size:15px;"
       x="100"
       y="130"
       id="TextName">Living Room</text>
    <text class="text"
       style="font-size:13px;"
       x="100"
       y="25"
       id="TextTargetTemperature">19°C</text>
    <text class="text"
       style="font-size:8px;font-weight:bold;"
       x="100"
       y="70"
       id="TextMode">SCHEDULE</text>
    <text class="text"
       style="font-size:19px;"
       x="150"
       y="105"
       id="TextPosition">100%</text>
  </g>
  <g
     id="Modes"
     style="display:inline">
    <path class="mode"
       id="Mode-eco"
       style="display:none"
       d="m 100,40 h 5 m -5,20 v -8 c 0,0 -12,6 -15,0 -3,-6 15,-22 15,-22 0,0 18,16 15,22 -3,6 -15,0 -15,0 m 0,-7 h -5" />
    <path class="mode"
       id="Mode-comfort"
       style="display:none"
       d="M 95,51 V 40 m 10,0 V 51 M 90,50 c 6.7,2.7 13.4,2.6 20,0 M 90,45 c 0,-3.1 0,-8.2 0,-10 -0,-5.1 20,-4.7 20,0 0,1.7 0,6.7 0,10 m 0,10 c -6.2,2.2 -12.8,3.1 -20,0 m 20,-10 c 0,0 1.6,-3.4 4,-1 2.4,2.4 0,16 0,16 h -4 z M 86,44 c 2.4,-2.4 4,1 4,1 v 15 h -4 c 0,0 -2.4,-13.6 0,-16 z" />
    <path class="mode"
       id="Mode-complex"
       style="display:none"
       d="m 110,35 c 0,2.8 -2.2,5 -5,5 -2.8,0 -5,-2.2 -5,-5 0,-2.8 2.2,-5 5,-5 2.8,0 5,2.2 5,5 z M 95,55 c 0,2.8 -2.2,5 -5,5 -2.8,0 -5,-2.2 -5,-5 0,-2.8 2.2,-5 5,-5 2.8,0 5,2.2 5,5 z m 20,2.5 c 0,1.4 -1.1,2.5 -2.5,2.5 -1.4,0 -2.5,-1.1 -2.5,-2.5 0,-1.4 1.1,-2.5 2.5,-2.5 1.4,0 2.5,1.1 2.5,2.5 z m -10,-10 c 0,4.1 -3.4,7.5 -7.5,7.5 -4.1,0 -7.5,-3.4 -7.5,-7.5 0,-4.1 3.4,-7.5 7.5,-7.5 4.1,0 7.5,3.4 7.5,7.5 z m 10,-5 c 0,4.1 -3.4,7.5 -7.5,7.5 -4.1,0 -7.5,-3.4 -7.5,-7.5 0,-4.1 3.4,-7.5 7.5,-7.5 4.1,0 7.5,3.4 7.5,7.5 z M 95,35 c 0,2.8 -2.2,5 -5,5 -2.8,0 -5,-2.2 -5,-5 0,-2.8 2.2,-5 5,-5 2.8,0 5,2.2 5,5 z" />
    <path class="mode"
       id="Mode-boost" 
	   style="display:none"
       d="M 100,60 V 45.773196 M 100,30 85,45 c 10,-5 20,-5 30,0 L 100,30" />
    <path class="mode"
       id="Mode-manual"
	   style="display:none"
       d="m 100,32 c 1,-1 3.2,-2.7 5,0 2,3 0,8 0,13 m 0,-13 c 0,0 2.6,-2.4 5,0 2.4,2.4 0,13 0,13 m 1,-8 c 0,0 1.2,-1.8 3,0 1.8,1.8 0,8 0,8 l -4,15 H 95 c 0,0 -3.3,-6.7 -5,-10 -1.7,-3.3 -5.4,-6.7 -4,-9 1.4,-2.3 3.1,-1.8 5,-1 1.9,0.8 4,5 4,5 0,0 -2,-11 0,-13 2,-2 4,-1 5,0 1,1 0,13 0,13" />
    <path class="mode"
       id="Mode-schedule"
       style="display:inline"
       d="m 110,53 h 5 v 5 h -5 z m -10,0 h 5 v 5 h -5 z m -15,0 h 10 v 5 H 85 Z M 95,43 h 20 v 5 H 95 Z m -10,0 h 5 v 5 h -5 z m 20,-10 h 10 v 5 h -10 z m -10,0 h 5 v 5 h -5 z m -10,0 h 5 v 5 h -5 z" />
    <path class="mode"
       id="Mode-away"
       style="display:none"
       d="m 85,35 30,5 V 60 L 85,55 m 0,0 V 35 l 20,-5 v 8.8" />
    <path class="mode"
       id="Mode-none"
       style="display:none"
       d="" />
  </g>
  
  <g
     id="Clips"
     style="display:none">
    <clipPath id="ClipPosition" style="transition-duration: 2s">
	<path
       id=""
       style="fill:#0000ff;fill-opacity:0.5;stroke:none;stroke-opacity:1"
       d="m 120,10 c 1,0 2,0 3,0 C 1221,10 121,10 120,10 Z m 0,0 c -38.7,0 -70,31.3 -70,70 0,38.7 31.3,70 70,70 38.7,0 70,-31.3 70,-70 h -70 z m 70,70 C 63.3,26.7 126.7,53.3 190,80 Z" />
	</clipPath>
    <clipPath id="ClipTemperature" style="transition-duration: 2s">
    <path
       id=""
       style="fill:#ff0000;fill-opacity:0.5;stroke:none;stroke-opacity:1"
       d="M 80,10 V 80 H 10 c -2,48 53.2,84.9 96.8,64.8 C 153.3,127.9 164.5,60.6 127.8,28.8 115,16.8 97.6,10 80,10 Z m 0,0 C 26.7,3.3 53.3,6.7 80,10 Z M 10,80 C 3.3,26.7 6.7,53.3 10,80 Z" />
	</clipPath>
  </g>
  
  <g
     inkscape:groupmode="layer"
     id="layer2"
     inkscape:label="Gauges"
     style="display:inline">
    <path
       id="GaugePosition"
       style="fill:var(--label-badge-blue);fill-opacity:1;stroke:none;stroke-opacity:1"
       d="m 120,10 v 20 a 65,60 0 0 1 64.08008,50 H 190 A 70,70 0 0 0 120,10 Z" 
	   clip-path="url(#ClipPosition)"/>
    <path
       id="GaugeTemperature"
       style="fill:#ff0000;fill-opacity:1;stroke:none;stroke-opacity:1"
       d="M 80,10 A 70,70 0 0 0 10,80 h 5.996094 A 65,60 0 0 1 80,30 Z" 
	   clip-path="url(#ClipTemperature)"/>
  </g>
  <g
     id="Pointers">
    <path
       style="fill:#808080;fill-opacity:1;stroke:var(--primary-text-color);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
       d="M 5,85 V 75 l 5,5 -5,5"
       id="ArrowTargetTemperature" />
    <path
       style="fill:#808080;fill-opacity:1;stroke:var(--primary-text-color);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
       d="m 20,80 60,-5 5,5 -5,5 -60,-5"
       id="HandTemperature" />
    <path
       style="fill:#808080;fill-opacity:1;stroke:var(--primary-text-color);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
       d="m 115,80 5,-5 60,5 -60,5 z"
       id="HandPosition" />
  </g>
  <rect
     style="display:none;fill:none;stroke:#000000;stroke-opacity:1"
     id="Frame"
     width="200"
     height="160"
     x="0"
     y="0"
     rx="75"
     ry="75" />
</svg>

		</div>	
	</div>	
	`;
	
    card.appendChild(content);
    card.appendChild(style);
	
    card.addEventListener('click', event => {
      this._fire('hass-more-info', { entityId: cardConfig.entity });
    });
    root.appendChild(card);
    this._config = cardConfig;	
  }

  _splitEntityAndAttribute(entity) {
      let parts = entity.split('.');
      if (parts.length < 3) {
          return { entity: entity };
      }

      return { attribute: parts.pop(), entity: parts.join('.') };
  }

  _fire(type, detail, options) {
    const node = this.shadowRoot;
    options = options || {};
    detail = (detail === null || detail === undefined) ? {} : detail;
    const event = new Event(type, {
      bubbles: options.bubbles === undefined ? true : options.bubbles,
      cancelable: Boolean(options.cancelable),
      composed: options.composed === undefined ? true : options.composed
    });
    event.detail = detail;
    node.dispatchEvent(event);
    return event;
  }
  
  _rotateTemperature(value, config) {
    return 90*((value - config.temp_min)/(config.temp_max - config.temp_min));
  }

  _rotatePosition(value) {
    return 90*(value/100);
  }  
  
  _computeSeverity(stateValue, sections) {
    let numberValue = Number(stateValue);
    const severityMap = {
      red: "var(--label-badge-red)",
      green: "var(--label-badge-green)",
      yellow: "var(--label-badge-yellow)",
      normal: "var(--label-badge-blue)",
    };
    if (!sections) return severityMap["normal"];
    let sortable = [];
    for (let severity in sections) {
      sortable.push([severity, sections[severity]]);
    }
    sortable.sort((a, b) => { return a[1] - b[1] });
    if (numberValue >= sortable[0][1] && numberValue < sortable[1][1]) {
      return severityMap[sortable[0][0]];
    }
    if (numberValue >= sortable[1][1] && numberValue < sortable[2][1]) {
      return severityMap[sortable[1][0]];
    }
    if (sortable.length === 4) {
      if (numberValue >= sortable[2][1] && numberValue < sortable[3][1]) {
        return severityMap[sortable[2][0]];
      }
      if (numberValue > sortable[3][1]) {
        return severityMap["normal"]
      }
    } else {
      if (numberValue >= sortable[2][1]) {
        return severityMap[sortable[2][0]];
      }
    }
    return severityMap["normal"];
  }
  _getEntityStateValue(entity, attribute) { 
    if (!attribute) {
      return entity.state;
    }

    return entity.attributes[attribute];
  }

  set hass(hass) {
    const root = this.shadowRoot;
    const config = this._config;
    var entityState = this._getEntityStateValue(hass.states[config.entity], config.attribute);
    var maxEntityState = null;
    var minEntityState = null;

    let measurement = "";
    if (config.measurement == null) {
      if (hass.states[config.entity].attributes.unit_of_measurement === undefined) {
        measurement = '';
      } else {
        measurement = hass.states[config.entity].attributes.unit_of_measurement;
      }
    } else {
      measurement = config.measurement;
    }
    

	/*if (entityState !== this._entityState)*/ {
	  var current_temperature = this._getEntityStateValue(hass.states[config.entity], "current_temperature");	  
      root.getElementById("TextTemperature").textContent = `${current_temperature}${measurement}`;
      const rotate_current_temperature = this._rotateTemperature(current_temperature, config);
      root.getElementById("HandTemperature").style.transform = `rotate(${rotate_current_temperature}deg)`;
      root.getElementById("ClipTemperature").style.transform = `rotate(${rotate_current_temperature}deg)`;
	  root.getElementById("GaugeTemperature").style.fill = this._computeSeverity(current_temperature, config.severity);

	  var target_temperature = this._getEntityStateValue(hass.states[config.entity], "temperature");	  
      root.getElementById("TextTargetTemperature").textContent = `${target_temperature}${measurement}`;
      const rotate_target_temperature = this._rotateTemperature(target_temperature, config);
      root.getElementById("ArrowTargetTemperature").style.transform = `rotate(${rotate_target_temperature}deg)`;
	  
	  var valve_position = this._getEntityStateValue(hass.states[config.entity], "position");
      root.getElementById("TextPosition").textContent = `${valve_position}%`;
      const rotate_valve_position = this._rotatePosition(valve_position);
      root.getElementById("HandPosition").style.transform = `rotate(-${rotate_valve_position}deg)`;
      root.getElementById("ClipPosition").style.transform = `rotate(-${rotate_valve_position}deg)`;

	  var friendly_name = this._getEntityStateValue(hass.states[config.entity], "friendly_name");
      root.getElementById("TextName").textContent = `${friendly_name}`;
	  
	  var preset_mode = this._getEntityStateValue(hass.states[config.entity], "preset_mode");
      root.getElementById("TextMode").textContent = `${preset_mode}`;	
      
	  let mode = ["none","away","schedule","manual","boost","complex","comfort","eco"];
	  for (var i = 0; i < mode.length; i++)
        root.getElementById(`Mode-${mode[i]}`).style = (preset_mode ===  mode[i]) ? "display:inline" : "display:none";

      this._entityState = entityState;		
    }
    root.lastChild.hass = hass;
  }

  getCardSize() {
    return 1;
  }
}

customElements.define('mini-thermo-gauge', MiniThermoGauge);