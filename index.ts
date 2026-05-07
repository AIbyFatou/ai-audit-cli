    type GitHubFile = {
    name: string;
    path: string;
    type: "file" | "dir";
    url: string;
    download_url: string | null;
}

const url = process.argv[2];

if(url === undefined){
    console.error("❌ Usage: npx ts-node index.ts <github-url>");
    process.exit(1);
}

const parts = url.split("/");
const owner = parts[3];
const repo = parts[4];

async function auditRepo() {
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    const data = await repoRes.json();

    if(data.visibility !== "public"){
        console.error("❌ This repository is private and not accessible for the audit!");
        process.exit(1);
    }

    const contentsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`);
    const dataLists: GitHubFile[] = await contentsRes.json();

    // Check 1 — .gitignore presence
    const gitIgnore = dataLists.find(f => f.name === ".gitignore");
    if(!gitIgnore){
        console.log("🔴 CRITICAL — No .gitignore found!");
    } else if(gitIgnore.download_url) {
        const content = await (await fetch(gitIgnore.download_url)).text();
        if(content.includes(".env")){
            console.log("🟢 OK — .gitignore contains .env");
        } else {
            console.log("🔴 CRITICAL — .gitignore does not contain .env so Your application is vulnerable !");
        }
    }

    // Check 2 — .env file exposed
    const envFile = dataLists.find(f => f.name === ".env");
    if(envFile){
        console.log("🔴 CRITICAL — .env file is exposed in the repository!");
    } else {
        console.log("🟢 OK — No .env file exposed directly into the repository");
    }
}

auditRepo();