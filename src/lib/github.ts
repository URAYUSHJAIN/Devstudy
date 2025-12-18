import { Octokit } from "octokit";

export const REPO_NAME = "my-system-designs";

export async function getOrCreateRepo(octokit: Octokit) {
  try {
    const { data } = await octokit.rest.repos.get({
      owner: (await octokit.rest.users.getAuthenticated()).data.login,
      repo: REPO_NAME,
    });
    return data;
  } catch (error: any) {
    if (error.status === 404) {
      // Create repo
      const { data } = await octokit.rest.repos.createForAuthenticatedUser({
        name: REPO_NAME,
        description: "System designs created with DevStudy",
        private: false, // Or true, depending on preference. Let's default to public for showcase.
        auto_init: true,
      });
      return data;
    }
    throw error;
  }
}

export async function pushFileToRepo(
  accessToken: string,
  fileName: string,
  content: string,
  message: string
) {
  const octokit = new Octokit({ auth: accessToken });
  const user = (await octokit.rest.users.getAuthenticated()).data;
  const owner = user.login;

  await getOrCreateRepo(octokit);

  // Check if file exists to get SHA
  let sha: string | undefined;
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo: REPO_NAME,
      path: fileName,
    });
    if (!Array.isArray(data) && data.sha) {
      sha = data.sha;
    }
  } catch (e) {
    // File doesn't exist, that's fine
  }

  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo: REPO_NAME,
    path: fileName,
    message,
    content: Buffer.from(content).toString("base64"),
    sha,
  });

  return `https://github.com/${owner}/${REPO_NAME}/blob/main/${fileName}`;
}

export async function getUserPinnedRepos(accessToken: string) {
    const octokit = new Octokit({ auth: accessToken });
    // GraphQL query to get pinned items
    const query = `
      query {
        viewer {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
                description
                url
                stargazerCount
                primaryLanguage {
                  name
                  color
                }
              }
            }
          }
        }
      }
    `;
    
    try {
        const response: any = await octokit.graphql(query);
        return response.viewer.pinnedItems.nodes;
    } catch (error) {
        console.error("Error fetching pinned repos:", error);
        return [];
    }
}
