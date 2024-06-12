# CHANGELOG

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.2.7] - 2024-06-12

### Changed

Lone Wolf Extreme
- *revenue_coef_per_km*: 0.12 => 0.1
- *cargo_market_revenue_coef_per_km*: 0.15 => 0.14

## [1.2.6] - 2024-06-12

### Changed

Lone Wolf Extreme
- *reward_bonus_level*: 0.06 => 0.05
- *exp_cargo_delivery*: 1.0 => 0.8
- *exp_free_roam*: 1.0 => 0.8
- *police_nearby_offence_timer*: 120.0 => 60.0

## [1.2.5] - 2024-06-09

### Changed

- Extra money for jobs. 0.09 => 0.12, with own trailer 0.1 => 0.15

## [1.2.4] - 2024-06-05

### Changed

- Parts wore longer.
- Extra money for jobs.
- Lower probability for fines.

## [1.2.2] - 2024-05-29

### Changed

- Price_small_garage: 400K => 200K, Price_garage_upgrade: 150K => 75K, Driver_hire_cost: 50K => 5K.
- Totally money to fill garage: 1300K => 800K.

## [1.2.1] - 2024-05-27

### Changed

- There only two fines that for sure: illegal trailer, illegal border crossing. Othere fines have are probability less than 100%.
- Lone Wolf Extreme - more income from quick jobs 0.015 => 0.02

## [1.2.0] - 2024-05-26

### Changed

- Fines are more immervise. Inspired by 'More realistic fines'. You will pay a fine primarily when you are caught by someone.

## [1.1.5] - 2024-05-25

### Changed

- Updated description with links to other mods.

## [1.1.2] - 2024-05-21

### Added

- Adjusted income.

## [1.1.0] - 2024-05-11

### Added

- New packges - LoneWolf with extreme difficulty level.

## [1.0.1] - 2023-11-24

### Bugfix

- Working on windows
- running script
- readme

## [1.0.0] - 2023-11-24

### Added

- Migrated from xlsx to in memory map
- Migrated from ps1 scripts to node (typescript esm)
- Inlucded missing trucks from DLC (they are in different dirs than def). There is potentiall problem on missing config becasue i dont have all DLC and i dont know which one have engine configuration. If you have any extra definition files let me know.
- Removed duplicated files
- Transformed files from CRLF to LF
