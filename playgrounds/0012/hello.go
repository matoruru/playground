package main

import (
	"fmt"
	"time"
	"sync"
)

func main() {
	start := time.Now()
	post := fetchPost()

	resChan := make(chan any, 2)
	var wg sync.WaitGroup
	wg.Add(2)

	go fetchPostLikes(post, resChan, &wg)
	go fetchPostComments(post, resChan, &wg)

	wg.Wait()

	close(resChan)

	for res := range resChan {
		fmt.Println("res: ", res)
	}

	fmt.Println("took: ", time.Since(start))
}

func fetchPost() string {
	time.Sleep(time.Millisecond * 50)
	return "What programming language do you perefer?"
}

func fetchPostLikes(post string, resChan chan any, wg *sync.WaitGroup) {
	time.Sleep(time.Millisecond * 50)
    resChan <- 10
	wg.Done()
}

func fetchPostComments(post string, resChan chan any, wg *sync.WaitGroup) {
	time.Sleep(time.Millisecond * 100)
	resChan <- []string{"Golang", "Java", "Rust"}
	wg.Done()
}
