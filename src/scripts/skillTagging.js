const tags = ["JavaScript", "React", "HTML", "CSS", "Python", "Django"];
const colors = ["#FF3E3E", "#FFA341", "#F7D415", "#32F548", "#3AE3E8", "#5C93FC", "#AF58FC", "#FC42F4"];
const filters = new Set();
const selectedText = "selected";

const projects = {
    "Quill Todo": {
        boxNode: null,
        tagListNode: null,
        tags: new Set(["React", "JavaScript", "HTML", "CSS", "Python", "Django"])
    },
    "The Art of Triggering Myself": {
        boxNode: null,
        tagListNode: null,
        tags: new Set(["HTML", "CSS", "JavaScript"])
    },
    "Me(Ta)": {
        boxNode: null,
        tagListNode: null,
        tags: new Set(["HTML", "CSS", "JavaScript"]),
    },
    "My Tech. Notes": {
        boxNode: null,
        tagListNode: null,
        tags: new Set(),
    },
    "Colgate Tech. Immersion Week": {
        boxNode: null,
        tagListNode: null,
        tags: new Set(["HTML", "CSS", "JavaScript", "Django", "React"]),
    }
}

const updateSections = () => {
    let shouldBeShown = true;
    Object.keys(projects).forEach((projectName) => {
        // If a project has all tags being filtered for, show it. Otherwise, hide it.
        for (let filter of filters) {
            if (!projects[projectName].tags.has(filter)) {
                // Hide and move on to next project
                projects[projectName].boxNode.style.display = "none";
                shouldBeShown = false;
                break;
            }
        }
        // Show section
        if (shouldBeShown) {
            projects[projectName].boxNode.style.display = "block";
        }
    })
}

const addFilter = (tag) => {
    filters.add(tag);
    updateSections();
}

const removeFilter = (tag) => {
    filters.delete(tag);
    updateSections();
}

const clearFilters = () => {
    filters.clear();
    for (let node of document.querySelectorAll("#tagList li")) {
        node.classList.remove(selectedText);
    }
    updateSections();
}

const getProjects = () => {
    const titles = document.querySelectorAll(".box .title-container h2");
    let title;
    titles.forEach((titleNode) => {
        title = titleNode.innerText;
        if (title in projects) {
            let currentNode = titleNode;
            // Get the node of the box and add it to the projects object to be hidden if needed
            while (!(currentNode.nodeName === "SECTION" && currentNode.classList.contains("box"))) {
                currentNode = currentNode.parentNode;
            }
            projects[title].boxNode = currentNode;
            // Get the node of the tags for this project and add to projects object to be added to
            projects[title].tagListNode = currentNode.querySelector("ul.tags");
        }
    })
}

const addTags = () => {
    getProjects();
    const list = document.querySelector("#tagList ul");
    // Add tags to tagList at the top of the page
    tags.forEach((tag, idx) => {
        // Create a tag
        const tagNode = document.createElement("li");
        tagNode.appendChild(document.createTextNode(tag));
        tagNode.classList.add("partial-fade-in-on-hover")
        tagNode.style.backgroundColor = colors[idx % colors.length];
        tagNode.addEventListener("click", () => toggleFilterTag(tagNode, tag, list));

        // Add to the top of the page and to any project tagList it appears in
        list.appendChild(tagNode);
        Object.keys(projects).forEach((projectName) => {
            if (projects[projectName].tags.has(tag)) {
                let toAdd = tagNode.cloneNode(true);
                toAdd.classList.remove("partial-fade-in-on-hover");
                projects[projectName].tagListNode.appendChild(toAdd.cloneNode(true));
            }
        });
    });
}

const toggleFilterTag = (element, tag, list) => {
    // Style the appearance of the tag
    if (element.classList.contains(selectedText)) {
        element.classList.remove(selectedText)
        removeFilter(tag);
    }
    else {
        element.classList.add(selectedText);
        addFilter(tag);
    }
}

addTags();
document.querySelector("#tagList button").addEventListener("click", () => clearFilters());