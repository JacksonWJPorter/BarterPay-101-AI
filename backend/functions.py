import json
import os


def create_assistant(client):
  assistant_file_path = 'assistant.json'

  if os.path.exists(assistant_file_path):
    with open(assistant_file_path, 'r') as file:
      assistant_data = json.load(file)
      assistant_id = assistant_data['assistant_id']
      print("Loaded existing assistant ID.")
  else:
    file = client.files.create(file=open("knowledge.docx", "rb"),
                               purpose='assistants')

    assistant = client.beta.assistants.create(
      instructions="""The assistant, BarterPay AI, has been programmed to be an expert on BarterPay's company information and to act as a resource for those who have questions. It should not answer anything outside of questions about BarterPay.\n  A document has been provided with a 101 course transcript for BarterPay.""",
      model="gpt-4-0125-preview",
      tools=[{"type": "retrieval"}],
      file_ids=[file.id])

    with open(assistant_file_path, 'w') as file:
      json.dump({'assistant_id': assistant.id}, file)
      print("Created a new assistant and saved the ID.")

    assistant_id = assistant.id

  return assistant_id
