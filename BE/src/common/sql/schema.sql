DROP TABLE IF EXISTS GAME_USER;
DROP TABLE IF EXISTS USER;
DROP TABLE IF EXISTS GAME_HISTORY;

CREATE TABLE user(
    user_id bigint auto_increment primary key,
    email varchar(30) not null,
    nickname varchar(30) not null,
    oauth_id varchar(100) not null,
    score int not null,
    created_at datetime not null,

    UNIQUE INDEX idx_email(email),
    INDEX idx_created_at(created_at)
);


CREATE TABLE game_history(
    game_id bigint auto_increment primary key,
    start_time datetime not null,
    end_time datetime null,
    game_history_result enum('MAFIA','CITIZEN') null,
    game_status enum('PROGRESS','END') not null,

    INDEX idx_start_time(start_time)
);

CREATE TABLE game_user(
    game_id bigint not null,
    user_id bigint not null,
    job enum('MAFIA','POLICE','DOCTOR','CITIZEN') null,
    game_user_result enum('WIN','LOSE') null,

    PRIMARY KEY (game_id, user_id),

    FOREIGN KEY (game_id)
        REFERENCES game_history(game_id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES user(user_id)
        ON DELETE CASCADE
);