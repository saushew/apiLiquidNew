package controllers

import (
	"github.com/go-redis/redis"
)

func runRedis() (*redis.Client, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})

	pong, err := client.Ping().Result()
	if pong == "PONG" {
		return client, nil
	} else {
		return nil, err
	}
}

func RedisSet(client *redis.Client, key string, value string) error {
	err := client.Set(key, value, 0).Err()

	if err != nil {
		return err
	}

	return nil
}

func RedisGet(client *redis.Client, key string) (string, error) {
	val, err := client.Get(key).Result()
	if err != nil {
		return "", err
	}

	return val, nil
}
