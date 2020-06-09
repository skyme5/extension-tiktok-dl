from threading import Thread
from queue import Queue
from time import sleep

from loguru import logger

queue = Queue()

def tiktok_downloader():
    """
    function to print square of given num
    """
    # t = TikTok(
    #     output_template="D:/TikTok/{user_id}/{Y}-{m}/{id}_{user_id}",
    #     download_archive="C:/msys64/home/sky/tiktok.archive.txt",
    # )
    while True:
        logger.debug('Looking for urls to download, {} in queue', queue._qsize())
        if not queue.empty():
            url = queue.get()
            # t.download(url)
            queue.task_done()
        sleep(1)

if __name__ == "__main__":
    # creating thread
    th = Thread(target=tiktok_downloader, daemon=False)

    # starting thread 1
    th.start()
    # wait until thread 1 is completely executed
    # t1.join()
    # wait until thread 2 is completely executed
    # t2.join()

    # both threads completely executed
    print("Done!")