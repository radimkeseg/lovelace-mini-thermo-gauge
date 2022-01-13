# Lovelace mini-thermo-gauge

A Home Assistant lovelace custom mini gauge card for any measurement.

![mini thermo gauge light](https://github.com/radimkeseg/lovelace-mini-thermo-gauge/blob/main/images/mini-thermo-gauge-light.png)
![mini thermo gauge dark](https://github.com/radimkeseg/lovelace-mini-thermo-gauge/blob/main/images/mini-thermo-gauge-dark.png)


## Usage
Add this card via HACS (recommended)
[HACS custom repositories](https://hacs.xyz/docs/faq/custom_repositories) add https://github.com/radimkeseg/lovelace-mini-thermo-gauge

Or manually :
Add this custom card to your home assistant instance. Reference it into your lovelace configuration.
```
  - type: js
    url: /local/lovelace/mini-thermo-gauge.js
```

Finally :
Add it as a custom card to your lovelace : `'custom:mini-thermo-gauge'`.

## Options
### Card options
| **Option** | **Type** | **Description** |
|-|:-:|-|
| `entity` ***(required)*** | string | an entity to track, make sure the entity state is a number |
| `min` ***(required)*** | number | minimum value of the gauge |
| `max` ***(required)*** | number | maximum value of the gauge |
| `measurement` | string | custom unit of measurement |
| `scale` | number | sizing factor, default = 1 |
| `severity` | [severity object](#severity-object) | Severity map to change the gauge color. |

#### Severity object
| **Option** | **Type** | **Description** |
|-|:-:|-|
| `green` ***(required)*** | number | Value for the color green.
| `yellow` ***(required)*** | number | Value for the color yellow.
| `red` ***(required)*** | number | Value for the color red.
| `max` | number | Maximum value of the last step, normal color will be rendered above


An example for a picture-element:
```yaml
type: picture-elements
elements:
  - type: custom:mini-thermo-gauge
    temp_max: 25
    temp_min: 15
    measurement: °C
    entity: climate.thermo_livingroom
    scale: 0.75
    severity:
      green: 19
      yellow: 23
      red: 25
    style:
      top: 10%
      left: 50%
```

An example for a card:
```yaml
type: custom:mini-thermo-gauge
temp_max: 30
temp_min: 15
measurement: °C
entity: climate.thermo_livingroom
scale: 1
severity:
  green: 19
  yellow: 23
  red: 25
```

Time to time upgrading, mainly for my own purpose, anyway feel free to reuse ! 
PRs are welcome ;).
