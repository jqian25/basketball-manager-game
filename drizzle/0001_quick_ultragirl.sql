CREATE TABLE `facilities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`facilityType` enum('training_court','gym','medical_center','fan_zone','sponsor_lounge') NOT NULL,
	`level` int NOT NULL DEFAULT 1,
	`bonusType` varchar(50) NOT NULL,
	`bonusValue` float NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `facilities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leagueStandings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leagueId` int NOT NULL,
	`userId` int NOT NULL,
	`teamId` int NOT NULL,
	`rank` int NOT NULL,
	`wins` int NOT NULL DEFAULT 0,
	`losses` int NOT NULL DEFAULT 0,
	`pointsFor` int NOT NULL DEFAULT 0,
	`pointsAgainst` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leagueStandings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leagues` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`tier` enum('amateur','professional','world') NOT NULL,
	`season` int NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`rewards` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leagues_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`matchType` enum('guest','registered') NOT NULL,
	`homeTeamId` int NOT NULL,
	`awayTeamId` int NOT NULL,
	`homeScore` int NOT NULL DEFAULT 0,
	`awayScore` int NOT NULL DEFAULT 0,
	`duration` int NOT NULL DEFAULT 48,
	`homeStats` text,
	`awayStats` text,
	`playerStats` text,
	`mvpPlayerId` int,
	`winner` enum('home','away','draw') NOT NULL,
	`replayData` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `matches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `players` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`position` enum('PG','SG','SF','PF','C') NOT NULL,
	`bodyType` int NOT NULL DEFAULT 2,
	`scoring` int NOT NULL DEFAULT 10,
	`passing` int NOT NULL DEFAULT 10,
	`defense` int NOT NULL DEFAULT 10,
	`athleticism` int NOT NULL DEFAULT 10,
	`basketballIQ` int NOT NULL DEFAULT 10,
	`stamina` int NOT NULL DEFAULT 10,
	`threePointTendency` int NOT NULL DEFAULT 25,
	`midRangeTendency` int NOT NULL DEFAULT 25,
	`driveTendency` int NOT NULL DEFAULT 25,
	`postUpTendency` int NOT NULL DEFAULT 25,
	`experience` int NOT NULL DEFAULT 0,
	`level` int NOT NULL DEFAULT 1,
	`growthType` varchar(50) NOT NULL DEFAULT 'balanced',
	`avatarUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `players_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sponsors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`logoUrl` text,
	`contractValue` int NOT NULL,
	`contractDuration` int NOT NULL,
	`remainingMatches` int NOT NULL,
	`minWinRate` float NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sponsors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`lineup` text NOT NULL,
	`pace` enum('slow','normal','fast') NOT NULL DEFAULT 'normal',
	`spacing` enum('inside','balanced','outside') NOT NULL DEFAULT 'balanced',
	`defenseStrategy` enum('man','zone') NOT NULL DEFAULT 'man',
	`wins` int NOT NULL DEFAULT 0,
	`losses` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `teams_id` PRIMARY KEY(`id`)
);
