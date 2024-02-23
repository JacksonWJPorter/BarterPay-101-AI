import requests

def start_new_thread():
    url = 'http://127.0.0.1:5000/start'  # Flask server URL for starting new conversation
    response = requests.get(url)
    if response.status_code == 200:
        return response.json().get('thread_id')
    else:
        print(f"Failed to start a new thread. Status Code: {response.status_code}")
        return None

def chat_with_server(message, thread_id):
    url = 'http://127.0.0.1:5000/chat'  # Flask server URL for chatting
    payload = {
        'message': message,
        'thread_id': thread_id
    }
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        return response.json()
    else:
        return {'error': f'Server returned status code {response.status_code}'}

def main():
    thread_id = input("Enter your thread ID (or 'new' to start a new conversation): ")
    if thread_id == 'new':
        thread_id = start_new_thread()
        if thread_id is None:
            print("Could not create a new thread. Please check your server.")
            return

    while True:
        user_input = input("You: ")
        if user_input.lower() == 'exit':
            print("Exiting the chat.")
            break

        response = chat_with_server(user_input, thread_id)
        if 'error' in response:
            print(f"Error: {response['error']}")
            if 'error' in response and response['error'].startswith('Server returned status code'):
                # Handle specific error if the server response is not 200 OK
                break
        else:
            print(f"Bot: {response['response']}")

if __name__ == '__main__':
    main()
