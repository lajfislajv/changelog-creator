# Changelog Creator

Changelog Creator is a web application that helps you generate changelogs for your projects. You can add new, improved, and fixed items, and the application will generate a formatted changelog using OpenAI's GPT-4 model.

## Getting Started

### Prerequisites

- Node.js
- An OpenAI API key

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/changelog-creator.git
    cd changelog-creator
    ```

2. Install dependencies:
    ```sh
    npm install
    npm install openai
    ```

3. Create a `.env` file in the root directory and add your OpenAI API key:
    ```env
    OPENAI_API_KEY=your_openai_api_key
    ```

### Running the Application

1. Open [index.html](http://_vscodecontentref_/3) in your web browser.

### Usage

1. Add items to the "NEW", "IMPROVED", and "FIXED" sections by typing in the input fields and clicking the "Add" button.
2. Click the "Generate Changelog" button to generate a formatted changelog.
3. The generated changelog will be displayed in the output panel.

### Files

- **index.html**: The main HTML file that contains the structure of the application.
- **index.css**: The CSS file that styles the application.
- **index.js**: The JavaScript file that contains the logic for adding tasks, generating the changelog, and interacting with the OpenAI API.
- **images/loader.svg**: The loading spinner image displayed while waiting for the API response.

### Functions

- **addTask(type, task)**: Adds a task to the specified type (new, improved, or fixed) and updates the local storage and UI.
- **deleteTask(type, index)**: Deletes a task from the specified type and updates the local storage and UI.
- **getTaskList(type)**: Returns the list of tasks for the specified type.
- **renderTasks(type)**: Renders the tasks for the specified type in the UI.
- **updateGenerateButton()**: Updates the state of the "Generate Changelog" button based on the presence of tasks.
- **formatMarkdown(text)**: Formats the generated changelog text as HTML.
- **renderReport(output)**: Renders the generated changelog in the output panel.

### API Integration

The application uses the OpenAI API to generate the changelog. The request is sent to the `https://api.openai.com/v1/chat/completions` endpoint with the following payload:

```json
{
    "model": "gpt-4o-mini",
    "messages": [
        { "role": "system", "content": "You are a helpful AI assistant that creates changelogs." },
        {
            "role": "user",
            "content": "Generate a changelog based on new: [newTasks], improved: [improvedTasks], fixed: [fixedTasks]. Do not use backticks or 'markdown' in the output. It has to match the following format:\n### New\n* [9470] New feature\n* [9471] Another feature\n### Improved\n* [9472] Improved feature\n* [9473] Another improved feature\n### Fixed\n* [9474] Fixed bug\n* [9475] Another fixed bug"
        }
    ]
}
