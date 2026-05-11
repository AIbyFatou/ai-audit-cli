type GitHubFile = {
    name: string;
    path: string;
    type: "file" | "dir";
    url: string;
    download_url: string | null;
}

const url = process.argv[2];

if (url === undefined) {
    console.error("❌ Usage: npx ts-node index.ts <github-url>");
    process.exit(1);
}

const parts = url.split("/");
const owner = parts[3];
const repo = parts[4];

async function checkGitignore(dataLists: GitHubFile[]): Promise<number> {
    const gitIgnore = dataLists.find(f => f.name === ".gitignore");
    if (!gitIgnore || !gitIgnore.download_url) {
        console.log("🔴 CRITICAL — No .gitignore found!");
        return 0;
    }
    const content = await (await fetch(gitIgnore.download_url)).text();
    if (content.includes(".env")) {
        console.log("🟢 OK — .gitignore contains .env");
        return 25;
    }
    console.log("🔴 CRITICAL — .gitignore does not contain .env so your application is vulnerable!");
    return 0;
}

async function checkEnvExposed(dataLists: GitHubFile[]): Promise<number> {
    const envFile = dataLists.find(f => f.name === ".env");
    if (envFile) {
        console.log("🔴 CRITICAL — .env file is exposed in the repository!");
        return 0;
    }
    console.log("🟢 OK — No .env file exposed directly into the repository");
    return 25;
}

async function checkSupabaseFolder(dataLists: GitHubFile[]): Promise<number> {
    const supabaseFolder = dataLists.find(f => f.name === "supabase" && f.type === "dir");
    if (!supabaseFolder) {
        console.log("🔴 CRITICAL — There is no Supabase folder in this repository!");
        return 0;
    }
    console.log("🟢 OK — The repo contains a supabase folder!");
    return 25;
}

async function checkTestEnvironment(dataLists: GitHubFile[]): Promise<number> {
    const packageJson = dataLists.find(f => f.name === "package.json");
    if (!packageJson?.download_url) {
        console.log("🔴 CRITICAL — No package.json found!");
        return 0;
    }
    const content = await (await fetch(packageJson.download_url)).text();
    if (content.includes("vitest") || content.includes("jest") || content.includes("playwright") || content.includes("cypress")) {
        console.log("🟢 OK — This repo has a testing environment");
        return 25;
    }
    console.log("🔴 CRITICAL — There is no testing environment in this project!");
    return 0;
}

async function auditRepo() {
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    const data = await repoRes.json();

    if (data.visibility !== "public") {
        console.error("❌ This repository is private and not accessible for the audit!");
        process.exit(1);
    }

    const contentsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`);
    const dataLists: GitHubFile[] = await contentsRes.json();

    const score =
        await checkGitignore(dataLists) +
        await checkEnvExposed(dataLists) +
        await checkSupabaseFolder(dataLists) +
        await checkTestEnvironment(dataLists);

    console.log(`\n📊 SCORE : ${score}/100`);
}

auditRepo();