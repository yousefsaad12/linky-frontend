import { site } from "@/lib/site";
import type { CodeSnippets } from "../types";

export const CODE_SNIPPETS_MAP: Record<string, CodeSnippets> = {
  "redirect-link": {
    nodejs: `// Node.js - Get redirect without following
const response = await fetch("${site.apiUrl}/k9Xm", {
  method: "GET",
  redirect: "manual"
});

const targetUrl = response.headers.get("location");
console.log("Redirect Destination:", targetUrl);`,
    dotnet: `// .NET (C#) - Get redirect without following
using (var client = new HttpClient())
{
    var request = new HttpRequestMessage(HttpMethod.Get, "${site.apiUrl}/k9Xm");
    var response = await client.SendAsync(request);
    var location = response.Headers.Location;
    Console.WriteLine("Redirecting to: " + location);
}`,
    python: `import requests

# Get target location without executing redirect
response = requests.get(
    "${site.apiUrl}/k9Xm",
    allow_redirects=False
)

destination = response.headers.get("Location")
print("Redirecting to:", destination)`,
    go: `package main

import (
    "fmt"
    "net/http"
)

func main() {
    client := &http.Client{
        CheckRedirect: func(req *http.Request, via []*http.Request) error {
            return http.ErrUseLastResponse
        },
    }
    
    resp, err := client.Get("${site.apiUrl}/k9Xm")
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    
    location := resp.Header.Get("Location")
    fmt.Println("Redirecting to:", location)
}`,
    spring: `// Spring Boot - Get redirect without following
@RestController
public class RedirectController {
    
    @GetMapping("/redirect")
    public ResponseEntity<String> getRedirect() {
        RestTemplate restTemplate = new RestTemplate();
        
        HttpHeaders headers = new HttpHeaders();
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        ResponseEntity<String> response = restTemplate.exchange(
            "${site.apiUrl}/k9Xm",
            HttpMethod.GET,
            entity,
            String.class
        );
        
        String location = response.getHeaders().getLocation().toString();
        return ResponseEntity.ok("Redirecting to: " + location);
    }
}`,
    response: `HTTP/1.1 302 Found
Location: https://example.com/blog/article-1
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
Access-Control-Allow-Origin: *`
  },
  "create-link": {
    nodejs: `// Node.js - Create Short URL
const response = await fetch("${site.apiUrl}/api/v1/url", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
  },
  body: JSON.stringify({
    originalUrl: "https://example.com/blog/article-1"
  })
});

const result = await response.json();
console.log("Short link:", result.data.shortUrl);`,
    dotnet: `// .NET (C#) - Create Short URL
using (var client = new HttpClient())
{
    client.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_API_KEY");
    
    var payload = new {
        originalUrl = "https://example.com/blog/article-1"
    };
    
    var json = JsonSerializer.Serialize(payload);
    var content = new StringContent(json, Encoding.UTF8, "application/json");
    
    var response = await client.PostAsync("${site.apiUrl}/api/v1/url", content);
    var responseString = await response.Content.ReadAsStringAsync();
    
    var result = JsonSerializer.Deserialize<JsonElement>(responseString);
    Console.WriteLine("Short link: " + result.GetProperty("data").GetProperty("shortUrl").GetString());
}`,
    python: `import requests

url = "${site.apiUrl}/api/v1/url"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}
payload = {
    "originalUrl": "https://example.com/blog/article-1"
}

response = requests.post(url, headers=headers, json=payload)
data = response.json()
print("Short link:", data["data"]["shortUrl"])`,
    go: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
    "strings"
)

type CreateLinkRequest struct {
    OriginalURL string \`json:"originalUrl"\`
}

func main() {
    payload := CreateLinkRequest{
        OriginalURL: "https://example.com/blog/article-1",
    }
    
    jsonData, _ := json.Marshal(payload)
    
    req, _ := http.NewRequest("POST", "${site.apiUrl}/api/v1/url", bytes.NewBuffer(jsonData))
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    
    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    
    data := result["data"].(map[string]interface{})
    fmt.Println("Short link:", data["shortUrl"])
}`,
    spring: `// Spring Boot - Create Short URL
@RestController
public class UrlController {
    
    @PostMapping("/api/v1/url")
    public ResponseEntity<String> createLink(@RequestBody CreateLinkRequest request) {
        RestTemplate restTemplate = new RestTemplate();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth("YOUR_API_KEY");
        
        HttpEntity<CreateLinkRequest> entity = new HttpEntity<>(request, headers);
        
        ResponseEntity<String> response = restTemplate.exchange(
            "${site.apiUrl}/api/v1/url",
            HttpMethod.POST,
            entity,
            String.class
        );
        
        return ResponseEntity.ok(response.getBody());
    }
}`,
    response: `{
  "status": "success",
  "data": {
    "id": "url_k9Xm12",
    "originalUrl": "https://example.com/blog/article-1",
    "shortCode": "k9Xm",
    "shortUrl": "${site.apiUrl}/k9Xm",
    "clicksCount": 0,
    "createdAt": "2026-05-20T18:00:00.000Z"
  }
}`
  },
  "analytics-overview": {
    nodejs: `// Node.js - Get Analytics Overview
const params = new URLSearchParams({ period: "7d" });
const response = await fetch(\`${site.apiUrl}/api/v1/analytics/overview?\${params}\`, {
  headers: {
    "Authorization": "Bearer YOUR_API_KEY"
  }
});

const { data } = await response.json();
console.log("Total clicks:", data.summary.totalClicks);`,
    dotnet: `// .NET (C#) - Get Analytics Overview
using (var client = new HttpClient())
{
    client.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_API_KEY");
    
    var response = await client.GetAsync("${site.apiUrl}/api/v1/analytics/overview?period=7d");
    var responseString = await response.Content.ReadAsStringAsync();
    
    var result = JsonSerializer.Deserialize<JsonElement>(responseString);
    var totalClicks = result.GetProperty("data").GetProperty("summary").GetProperty("totalClicks").GetInt32();
    Console.WriteLine("Total Link Clicks: " + totalClicks);
}`,
    python: `import requests

response = requests.get(
    "${site.apiUrl}/api/v1/analytics/overview",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    params={"period": "7d"}
)

data = response.json()["data"]
print("Total Link Clicks:", data["summary"]["totalClicks"])`,
    go: `package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

func main() {
    req, _ := http.NewRequest("GET", "${site.apiUrl}/api/v1/analytics/overview?period=7d", nil)
    req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    
    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    
    data := result["data"].(map[string]interface{})
    summary := data["summary"].(map[string]interface{})
    fmt.Println("Total Link Clicks:", summary["totalClicks"])
}`,
    spring: `// Spring Boot - Get Analytics Overview
@RestController
public class AnalyticsController {
    
    @GetMapping("/analytics/overview")
    public ResponseEntity<String> getOverview(@RequestParam String period) {
        RestTemplate restTemplate = new RestTemplate();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth("YOUR_API_KEY");
        
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        ResponseEntity<String> response = restTemplate.exchange(
            "${site.apiUrl}/api/v1/analytics/overview?period=" + period,
            HttpMethod.GET,
            entity,
            String.class
        );
        
        return ResponseEntity.ok(response.getBody());
    }
}`,
    response: `{
  "status": "success",
  "data": {
    "summary": {
      "totalClicks": 12450,
      "activeLinks": 42,
      "totalLinks": 50,
      "clicksChange": 12.5
    },
    "timeline": [
      { "date": "2026-05-19", "clicks": 450 },
      { "date": "2026-05-20", "clicks": 520 }
    ],
    "breakdowns": {
      "countries": [
        { "name": "United States", "value": 5420 },
        { "name": "United Kingdom", "value": 2100 },
        { "name": "Germany", "value": 1500 }
      ],
      "devices": [
        { "name": "Mobile", "value": 7800 },
        { "name": "Desktop", "value": 4650 }
      ],
      "referrers": [
        { "name": "Twitter/X", "value": 6200 },
        { "name": "Google", "value": 3100 },
        { "name": "Direct", "value": 3150 }
      ]
    }
  }
}`
  },
  "analytics-top-links": {
    nodejs: `// Node.js - Get Top Performing Links
const response = await fetch("${site.apiUrl}/api/v1/analytics/top-links?limit=3", {
  headers: {
    "Authorization": "Bearer YOUR_API_KEY"
  }
});

const { data } = await response.json();

data.forEach(link => {
  console.log(\`\${link.shortCode}: \${link.clicks} clicks\`);
});`,
    dotnet: `// .NET (C#) - Get Top Performing Links
using (var client = new HttpClient())
{
    client.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_API_KEY");
    
    var response = await client.GetAsync("${site.apiUrl}/api/v1/analytics/top-links?limit=3");
    var responseString = await response.Content.ReadAsStringAsync();
    
    var result = JsonSerializer.Deserialize<JsonElement>(responseString);
    var links = result.GetProperty("data").EnumerateArray();
    
    foreach (var link in links)
    {
        var shortCode = link.GetProperty("shortCode").GetString();
        var clicks = link.GetProperty("clicks").GetInt32();
        Console.WriteLine(shortCode + ": " + clicks + " clicks");
    }
}`,
    python: `import requests

response = requests.get(
    "${site.apiUrl}/api/v1/analytics/top-links",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    params={"limit": 3}
)

top_links = response.json()["data"]

for link in top_links:
    print(f"{link['shortCode']}: {link['clicks']} clicks")`,
    go: `package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

func main() {
    req, _ := http.NewRequest("GET", "${site.apiUrl}/api/v1/analytics/top-links?limit=3", nil)
    req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    
    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    
    links := result["data"].([]interface{})
    for _, link := range links {
        linkMap := link.(map[string]interface{})
        fmt.Printf("%s: %v clicks\n", linkMap["shortCode"], linkMap["clicks"])
    }
}`,
    spring: `// Spring Boot - Get Top Performing Links
@RestController
public class AnalyticsController {
    
    @GetMapping("/analytics/top-links")
    public ResponseEntity<String> getTopLinks(@RequestParam int limit) {
        RestTemplate restTemplate = new RestTemplate();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth("YOUR_API_KEY");
        
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        ResponseEntity<String> response = restTemplate.exchange(
            "${site.apiUrl}/api/v1/analytics/top-links?limit=" + limit,
            HttpMethod.GET,
            entity,
            String.class
        );
        
        return ResponseEntity.ok(response.getBody());
    }
}`,
    response: `{
  "status": "success",
  "data": [
    {
      "shortCode": "k9Xm",
      "originalUrl": "https://example.com/docs",
      "clicks": 4820,
      "createdAt": "2026-05-10T12:00:00.000Z"
    },
    {
      "shortCode": "p2Wq",
      "originalUrl": "https://github.com/yousefsaad12",
      "clicks": 3150,
      "createdAt": "2026-05-12T14:30:00.000Z"
    },
    {
      "shortCode": "a3Bc",
      "originalUrl": "https://twitter.com",
      "clicks": 1820,
      "createdAt": "2026-05-15T09:15:00.000Z"
    }
  ]
}`
  },
  "analytics-links": {
    nodejs: `// Node.js - Get All Links with Pagination
const query = new URLSearchParams({
  page: "1",
  limit: "2",
  sort: "createdAt"
});

const response = await fetch(\`${site.apiUrl}/api/v1/analytics/links?\${query}\`, {
  headers: {
    "Authorization": "Bearer YOUR_API_KEY"
  }
});

const { data } = await response.json();
console.log(\`Showing page \${data.pagination.currentPage} of \${data.pagination.totalPages}\`);`,
    dotnet: `// .NET (C#) - Get All Links with Pagination
using (var client = new HttpClient())
{
    client.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_API_KEY");
    
    var response = await client.GetAsync("${site.apiUrl}/api/v1/analytics/links?page=1&limit=2&sort=createdAt");
    var responseString = await response.Content.ReadAsStringAsync();
    
    var result = JsonSerializer.Deserialize<JsonElement>(responseString);
    var pagination = result.GetProperty("data").GetProperty("pagination");
    var currentPage = pagination.GetProperty("currentPage").GetInt32();
    var totalPages = pagination.GetProperty("totalPages").GetInt32();
    
    Console.WriteLine("Showing page " + currentPage + " of " + totalPages);
}`,
    python: `import requests

response = requests.get(
    "${site.apiUrl}/api/v1/analytics/links",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    params={"page": 1, "limit": 2, "sort": "createdAt"}
)

payload = response.json()["data"]
print("Total link resources:", payload["pagination"]["totalItems"])`,
    go: `package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

func main() {
    req, _ := http.NewRequest("GET", "${site.apiUrl}/api/v1/analytics/links?page=1&limit=2&sort=createdAt", nil)
    req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    
    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    
    data := result["data"].(map[string]interface{})
    pagination := data["pagination"].(map[string]interface{})
    fmt.Printf("Showing page %v of %v\n", pagination["currentPage"], pagination["totalPages"])
}`,
    spring: `// Spring Boot - Get All Links with Pagination
@RestController
public class AnalyticsController {
    
    @GetMapping("/analytics/links")
    public ResponseEntity<String> getLinks(
        @RequestParam int page,
        @RequestParam int limit,
        @RequestParam String sort
    ) {
        RestTemplate restTemplate = new RestTemplate();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth("YOUR_API_KEY");
        
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        String url = "${site.apiUrl}/api/v1/analytics/links?page=" + page + "&limit=" + limit + "&sort=" + sort;
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        
        return ResponseEntity.ok(response.getBody());
    }
}`,
    response: `{
  "status": "success",
  "data": {
    "links": [
      {
        "id": "url_k9Xm12",
        "originalUrl": "https://example.com/docs",
        "shortCode": "k9Xm",
        "shortUrl": "${site.apiUrl}/k9Xm",
        "clicksCount": 4820,
        "createdAt": "2026-05-10T12:00:00.000Z"
      },
      {
        "id": "url_p2Wq34",
        "originalUrl": "https://github.com/yousefsaad12",
        "shortCode": "p2Wq",
        "shortUrl": "${site.apiUrl}/p2Wq",
        "clicksCount": 3150,
        "createdAt": "2026-05-12T14:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 24,
      "totalItems": 48,
      "limit": 2
    }
  }
}`
  },
  "analytics-recent-clicks": {
    nodejs: `// Node.js - Get Recent Click Events
const response = await fetch("${site.apiUrl}/api/v1/analytics/recent-clicks?limit=2", {
  headers: {
    "Authorization": "Bearer YOUR_API_KEY"
  }
});

const { data } = await response.json();
console.log("Recent Click Event:", data[0]);`,
    dotnet: `// .NET (C#) - Get Recent Click Events
using (var client = new HttpClient())
{
    client.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_API_KEY");
    
    var response = await client.GetAsync("${site.apiUrl}/api/v1/analytics/recent-clicks?limit=2");
    var responseString = await response.Content.ReadAsStringAsync();
    
    var result = JsonSerializer.Deserialize<JsonElement>(responseString);
    var clicks = result.GetProperty("data").EnumerateArray();
    var firstClick = clicks.First();
    
    Console.WriteLine("Recent Click Event: " + firstClick);
}`,
    python: `import requests

response = requests.get(
    "${site.apiUrl}/api/v1/analytics/recent-clicks",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    params={"limit": 2}
)

clicks = response.json()["data"]

for click in clicks:
    print(f"Click on {click['shortCode']} from {click['country']} via {click['browser']}")`,
    go: `package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

func main() {
    req, _ := http.NewRequest("GET", "${site.apiUrl}/api/v1/analytics/recent-clicks?limit=2", nil)
    req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    
    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    
    clicks := result["data"].([]interface{})
    if len(clicks) > 0 {
        fmt.Println("Recent Click Event:", clicks[0])
    }
}`,
    spring: `// Spring Boot - Get Recent Click Events
@RestController
public class AnalyticsController {
    
    @GetMapping("/analytics/recent-clicks")
    public ResponseEntity<String> getRecentClicks(@RequestParam int limit) {
        RestTemplate restTemplate = new RestTemplate();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth("YOUR_API_KEY");
        
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        ResponseEntity<String> response = restTemplate.exchange(
            "${site.apiUrl}/api/v1/analytics/recent-clicks?limit=" + limit,
            HttpMethod.GET,
            entity,
            String.class
        );
        
        return ResponseEntity.ok(response.getBody());
    }
}`,
    response: `{
  "status": "success",
  "data": [
    {
      "id": "click_9021a",
      "shortCode": "k9Xm",
      "country": "United States",
      "countryCode": "US",
      "city": "San Francisco",
      "referrer": "Twitter/X",
      "device": "Mobile",
      "browser": "Safari",
      "os": "iOS",
      "timestamp": "2026-05-20T18:02:15.000Z"
    },
    {
      "id": "click_8912b",
      "shortCode": "p2Wq",
      "country": "United Kingdom",
      "countryCode": "GB",
      "city": "London",
      "referrer": "Direct",
      "device": "Desktop",
      "browser": "Chrome",
      "os": "Windows",
      "timestamp": "2026-05-20T18:01:40.000Z"
    }
  ]
}`
  },
  "analytics-link-detail": {
    nodejs: `// Node.js - Get Link Analytics Details
const response = await fetch("${site.apiUrl}/api/v1/analytics/links/k9Xm?period=30d", {
  headers: {
    "Authorization": "Bearer YOUR_API_KEY"
  }
});

const { data } = await response.json();
console.log(\`Link \${data.link.shortCode} has \${data.summary.totalClicks} clicks.\`);`,
    dotnet: `// .NET (C#) - Get Link Analytics Details
using (var client = new HttpClient())
{
    client.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_API_KEY");
    
    var response = await client.GetAsync("${site.apiUrl}/api/v1/analytics/links/k9Xm?period=30d");
    var responseString = await response.Content.ReadAsStringAsync();
    
    var result = JsonSerializer.Deserialize<JsonElement>(responseString);
    var totalClicks = result.GetProperty("data").GetProperty("summary").GetProperty("totalClicks").GetInt32();
    
    Console.WriteLine("Total Clicks: " + totalClicks);
}`,
    python: `import requests

response = requests.get(
    "${site.apiUrl}/api/v1/analytics/links/k9Xm",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    params={"period": "30d"}
)

data = response.json()["data"]
print(f"Total Clicks: {data['summary']['totalClicks']}")`,
    go: `package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

func main() {
    req, _ := http.NewRequest("GET", "${site.apiUrl}/api/v1/analytics/links/k9Xm?period=30d", nil)
    req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    
    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    
    data := result["data"].(map[string]interface{})
    summary := data["summary"].(map[string]interface{})
    fmt.Println("Total Clicks:", summary["totalClicks"])
}`,
    spring: `// Spring Boot - Get Link Analytics Details
@RestController
public class AnalyticsController {
    
    @GetMapping("/analytics/links/{shortCode}")
    public ResponseEntity<String> getLinkDetail(
        @PathVariable String shortCode,
        @RequestParam String period
    ) {
        RestTemplate restTemplate = new RestTemplate();
        
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth("YOUR_API_KEY");
        
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        String url = "${site.apiUrl}/api/v1/analytics/links/" + shortCode + "?period=" + period;
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        
        return ResponseEntity.ok(response.getBody());
    }
}`,
    response: `{
  "status": "success",
  "data": {
    "link": {
      "id": "url_k9Xm12",
      "originalUrl": "https://example.com/docs",
      "shortCode": "k9Xm",
      "shortUrl": "${site.apiUrl}/k9Xm",
      "createdAt": "2026-05-10T12:00:00.000Z"
    },
    "summary": {
      "totalClicks": 4820,
      "uniqueClicks": 3410
    },
    "timeline": [
      { "date": "2026-05-19", "clicks": 210 },
      { "date": "2026-05-20", "clicks": 245 }
    ],
    "breakdowns": {
      "countries": [
        { "name": "United States", "value": 2400 },
        { "name": "United Kingdom", "value": 1100 }
      ],
      "devices": [
        { "name": "Mobile", "value": 3100 },
        { "name": "Desktop", "value": 1720 }
      ],
      "referrers": [
        { "name": "Twitter/X", "value": 1820 },
        { "name": "LinkedIn", "value": 1100 },
        { "name": "Direct", "value": 900 }
      ]
    }
  }
}`
  }
};
