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
	  
		#groupHandTemperature, #groupArrowTargetTemperature, #ClipTemperature{
		  transform-origin: 80px 80px;
		  transition-duration: 2s;
		}
		#groupHandPosition, #ClipPosition{
		  transition-duration: 2s;
		  transform-origin: 120px 80px;
		}

		#HandTemperature, #ArrowTargetTemperature{
		  transform-origin: 80px 80px;
		  transition-duration: 2s;
		}
		#HandTemperature-Shadow, #ArrowTargetTemperature-Shadow{
		  transform: translate(5px,2px);
		  transform-origin: 85px 82px;
		  filter: blur(2px);
		  transition-duration: 2s;
		}
		#HandPosition{
		  transform-origin: 120px 80px;
		  transition-duration: 2s;
		}
		#HandPosition-Shadow{
		  transform: translate(5px,2px);
		  transform-origin: 123px 75px;
		  filter: blur(2px);
		  transition-duration: 2s;
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
		  fill:var(--primary-text-color);
		  transform: translate(88px,32px);
		}	
		
		.shadow{
		  fill: #000000;
		  fill-opacity:0.5;
		  stroke:none;
		}
		
		.guide{
          display:inline;
		  fill:none;
		  stroke:var(--primary-text-color);
		  stroke-width:1;
		  stroke-linecap:butt;
		  stroke-linejoin:miter;
		  stroke-miterlimit:4;
		  stroke-dasharray:1, 3;
		  stroke-dashoffset:0;
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
    <path  class="mode"
       id="Mode-eco"
       style="display:none;"
       d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
    <path class="mode"
       id="Mode-comfort"
       style="display:none;"
       d="M19 9V7C19 5.35 17.65 4 16 4H8C6.35 4 5 5.35 5 7V9C3.35 9 2 10.35 2 12V17C2 18.65 3.35 20 5 20V22H7V20H17V22H19V20C20.65 20 22 18.65 22 17V12C22 10.35 20.65 9 19 9M7 7C7 6.45 7.45 6 8 6H16C16.55 6 17 6.45 17 7V9.78C16.39 10.33 16 11.12 16 12V14H8V12C8 11.12 7.61 10.33 7 9.78V7M20 17C20 17.55 19.55 18 19 18H5C4.45 18 4 17.55 4 17V12C4 11.45 4.45 11 5 11S6 11.45 6 12V16H18V12C18 11.45 18.45 11 19 11S20 11.45 20 12V17Z" />
    <path class="mode"
       id="Mode-complex"
       style="display:none;"
       d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z" />
    <path class="mode"
       id="Mode-boost"
	   style="display:none;"
       d="M7.95,3L6.53,5.19L7.95,7.4H7.94L5.95,10.5L4.22,9.6L5.64,7.39L4.22,5.19L6.22,2.09L7.95,3M13.95,2.89L12.53,5.1L13.95,7.3L13.94,7.31L11.95,10.4L10.22,9.5L11.64,7.3L10.22,5.1L12.22,2L13.95,2.89M20,2.89L18.56,5.1L20,7.3V7.31L18,10.4L16.25,9.5L17.67,7.3L16.25,5.1L18.25,2L20,2.89M2,22V14A2,2 0 0,1 4,12H20A2,2 0 0,1 22,14V22H20V20H4V22H2M6,14A1,1 0 0,0 5,15V17A1,1 0 0,0 6,18A1,1 0 0,0 7,17V15A1,1 0 0,0 6,14M10,14A1,1 0 0,0 9,15V17A1,1 0 0,0 10,18A1,1 0 0,0 11,17V15A1,1 0 0,0 10,14M14,14A1,1 0 0,0 13,15V17A1,1 0 0,0 14,18A1,1 0 0,0 15,17V15A1,1 0 0,0 14,14M18,14A1,1 0 0,0 17,15V17A1,1 0 0,0 18,18A1,1 0 0,0 19,17V15A1,1 0 0,0 18,14Z" />
    <path class="mode"
       style="display:none;"
	   id="Mode-manual"
	   d="M3 16C3 20.42 6.58 24 11 24C14.43 24 17.5 21.91 18.77 18.73L21.33 12.3C21.58 11.66 21.56 10.92 21.18 10.35C20.69 9.61 19.82 9.29 19 9.5L18.22 9.73C17.76 9.85 17.34 10.08 17 10.39V4.5C17 3.12 15.88 2 14.5 2C14.31 2 14.13 2 13.96 2.06C13.75 .89 12.73 0 11.5 0C10.44 0 9.54 .66 9.17 1.59C8.96 1.53 8.73 1.5 8.5 1.5C7.12 1.5 6 2.62 6 4V4.55C5.84 4.5 5.67 4.5 5.5 4.5C4.12 4.5 3 5.62 3 7V16M5 7C5 6.72 5.22 6.5 5.5 6.5S6 6.72 6 7V12H8V4C8 3.72 8.22 3.5 8.5 3.5S9 3.72 9 4V12H11V2.5C11 2.22 11.22 2 11.5 2S12 2.22 12 2.5V12H14V4.5C14 4.22 14.22 4 14.5 4S15 4.22 15 4.5V15H17L18 12.5C18.15 12.05 18.5 11.71 19 11.59L19.5 11.45L16.91 18C15.95 20.41 13.61 22 11 22C7.69 22 5 19.31 5 16V7Z" />
    <path class="mode"
       id="Mode-schedule"
       style="display:none;"
       d="M18 4H2V2H18V4M17.5 13H16V18L19.61 20.16L20.36 18.94L17.5 17.25V13M24 17C24 20.87 20.87 24 17 24C13.47 24 10.57 21.39 10.08 18H2V12H1V10L2 5H18L19 10V10.29C21.89 11.16 24 13.83 24 17M3.04 10H16.96L16.36 7H3.64L3.04 10M4 16H10V12H4V16M22 17C22 14.24 19.76 12 17 12S12 14.24 12 17 14.24 22 17 22 22 19.76 22 17Z" />
    <path class="mode"
       id="Mode-away"
       style="display:none;"
       d="M13.34,8.17C12.41,8.17 11.65,7.4 11.65,6.47A1.69,1.69 0 0,1 13.34,4.78C14.28,4.78 15.04,5.54 15.04,6.47C15.04,7.4 14.28,8.17 13.34,8.17M10.3,19.93L4.37,18.75L4.71,17.05L8.86,17.9L10.21,11.04L8.69,11.64V14.5H7V10.54L11.4,8.67L12.07,8.59C12.67,8.59 13.17,8.93 13.5,9.44L14.36,10.79C15.04,12 16.39,12.82 18,12.82V14.5C16.14,14.5 14.44,13.67 13.34,12.4L12.84,14.94L14.61,16.63V23H12.92V17.9L11.14,16.21L10.3,19.93M21,23H19V3H6V16.11L4,15.69V1H21V23M6,23H4V19.78L6,20.2V23Z" />
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
    <path class="guide"
       style=""
       d="M 187,80 C 185,50 165,20 120,20"
       id="GaugePosition-Guide" />
    <path
       id="GaugePosition"
       style="fill:var(--label-badge-blue);fill-opacity:1;stroke:none;stroke-opacity:1"
       d="m 120,10 v 20 a 65,60 0 0 1 64.08008,50 H 190 A 70,70 0 0 0 120,10 Z" 
	   clip-path="url(#ClipPosition)"/>
    <path class="guide"
       style=""
       d="M 13,80 C 13,45 45,20 80,20"
       id="GaugeTemperature-Guide" />
    <path
       id="GaugeTemperature"
       style="fill:#ff0000;fill-opacity:1;stroke:none;stroke-opacity:1"
       d="M 80,10 A 70,70 0 0 0 10,80 h 5.996094 A 65,60 0 0 1 80,30 Z" 
	   clip-path="url(#ClipTemperature)"/>
  </g>
  <g
     id="Pointers">
    <g id="groupArrowTargetTemperature">
		<path class="shadow"
		   style=""
		   d="M 5,85 V 75 l 5,5 -5,5"
		   id="ArrowTargetTemperature-Shadow" />
		<path
		   style="fill:#808080;fill-opacity:1;stroke:var(--primary-text-color);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
		   d="M 5,85 V 75 l 5,5 -5,5"
		   id="ArrowTargetTemperature" />
	</g>		   
    <g id="groupHandTemperature">
		<path class="shadow"
		   style=""
		   d="m 20,80 60,-5 5,5 -5,5 -60,-5"
		   id="HandTemperature-Shadow" />
		<path
		   style="fill:#808080;fill-opacity:1;stroke:var(--primary-text-color);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
		   d="m 20,80 60,-5 5,5 -5,5 -60,-5"
		   id="HandTemperature" />
	</g>
    <g id="groupHandPosition">
		<path class="shadow"
		   style=""
		   d="m 115,80 5,-5 60,5 -60,5 z"
		   id="HandPosition-Shadow" />
		<path
		   style="fill:#808080;fill-opacity:1;stroke:var(--primary-text-color);stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
		   d="m 115,80 5,-5 60,5 -60,5 z"
		   id="HandPosition" />
	</g>

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
	if( value < config.temp_min ) value = config.temp_min;  
	if( value > config.temp_max ) value = config.temp_max;  
    return 90*((value - config.temp_min)/(config.temp_max - config.temp_min));
  }

  _rotatePosition(value) {
	if( value < 0 ) value = 0;  
	if( value > 100 ) value = 100;  
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
	
    var display_mode = (config.icon_color !== undefined ) ? "display:none" : ( config.shadow ? "display:inline" : "display:none");
	root.getElementById("HandTemperature-Shadow").style = display_mode;    
	root.getElementById("ArrowTargetTemperature-Shadow").style = display_mode;    
	root.getElementById("HandPosition-Shadow").style = display_mode;    


	/*if (entityState !== this._entityState)*/ {
	  var current_temperature = this._getEntityStateValue(hass.states[config.entity], "current_temperature");	  
      root.getElementById("TextTemperature").textContent = `${current_temperature}${measurement}`;
      const rotate_current_temperature = this._rotateTemperature(current_temperature, config);
      root.getElementById("HandTemperature").style.transform = `rotate(${rotate_current_temperature}deg)`;
      root.getElementById("HandTemperature-Shadow").style.transform = `rotate(${rotate_current_temperature}deg)`;
      root.getElementById("ClipTemperature").style.transform = `rotate(${rotate_current_temperature}deg)`;
	  root.getElementById("GaugeTemperature").style.fill = this._computeSeverity(current_temperature, config.severity);

	  var target_temperature = this._getEntityStateValue(hass.states[config.entity], "temperature");	  
      root.getElementById("TextTargetTemperature").textContent = `${target_temperature}${measurement}`;
      const rotate_target_temperature = this._rotateTemperature(target_temperature, config);
      root.getElementById("ArrowTargetTemperature").style.transform = `rotate(${rotate_target_temperature}deg)`;
      root.getElementById("ArrowTargetTemperature-Shadow").style.transform = `rotate(${rotate_target_temperature}deg)`;
	  
	  var valve_position = this._getEntityStateValue(hass.states[config.entity], "position");
      root.getElementById("TextPosition").textContent = `${valve_position}%`;
      const rotate_valve_position = this._rotatePosition(valve_position);
      root.getElementById("HandPosition").style.transform = `rotate(-${rotate_valve_position}deg)`;
      root.getElementById("HandPosition-Shadow").style.transform = `rotate(-${rotate_valve_position}deg)`;
      root.getElementById("ClipPosition").style.transform = `rotate(-${rotate_valve_position}deg)`;

	  var friendly_name = this._getEntityStateValue(hass.states[config.entity], "friendly_name");
      root.getElementById("TextName").textContent = `${friendly_name}`;
	  
	  var preset = this._getEntityStateValue(hass.states[config.entity], "preset");
	  var system_mode = this._getEntityStateValue(hass.states[config.entity], "system_mode");
      root.getElementById("TextMode").textContent = `${system_mode}`;	

      
	  let mode = ["none","away","schedule","manual","boost","complex","comfort","eco"];
	  for (var i = 0; i < mode.length; i++)
        root.getElementById(`Mode-${mode[i]}`).style = (preset ===  mode[i]) ? "display:inline" : "display:none";

      this._entityState = entityState;		
    }
    root.lastChild.hass = hass;
  }

  getCardSize() {
    return 1;
  }
}

customElements.define('mini-thermo-gauge', MiniThermoGauge);
