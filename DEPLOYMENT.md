# Render.com Deployment Instructions

Since Render.com doesn't have access to local files like `firebase.json`, you need to set the Firebase credentials as environment variables in the Render dashboard.

## Required Environment Variables

### Database
```
DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19UckVveURyc2RBX09TQ2hoVTRKa2MiLCJhcGlfa2V5IjoiMDFLM1hGMzk2UUhZUkc1NlBTQlJSWUJHM1kiLCJ0ZW5hbnRfaWQiOiI1ZWVmN2NkZjNlY2I3ZGU4OGVmYWUwOTM3OTQ2NTYwYTUwOGI1Y2Y3YzQwN2Y3NzEzNmM1MTQ0Y2RkYTU3OGQ0IiwiaW50ZXJuYWxfc2VjcmV0IjoiMWU0MTQ5NmUtNzk1YS00OWIyLWJkMGEtOWJkOTFhNDVhZWQ3In0.SuXbRD7KR4S43NXzjf_-okJli0RNb1Dr2zLykpF373I
```

### Firebase Authentication
```
FIREBASE_PROJECT_ID=cvision-7f747
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@cvision-7f747.iam.gserviceaccount.com
```

### Firebase Private Key
**IMPORTANT**: For the private key, you need to copy this exact value (including the quotes):
```
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCh70sJ5CMH8OsV
apTnUurxUucdS9agcDXKhjbnqVCMrxzP+GyM6PHlx2ZdnODYS8xaFD8Pi4vK0vNp
iuWWkeL0MAggNoNcj5dlySrSkp7danSzD64NJ9ayUgu3IGBC401zfyQMfivW2eKA
nuROOKVXl/Vrxq0IDVIcGiBO7eJ/HuA93ve2Oa6G7GSIl8CylpmcNYl8SWbYBLQc
FTy238EtDhlO61kpbpTYnocj4f2rHkXXIyQffGy7U5dMgAPWKLjXROkI3zT6Uvml
e8rIlIhUqoILGOGl8/INTlc1OX2wUKmmbaOsFIasM3VU8jrnIRZm2bSRZefC/3UD
vWbnVOALAgMBAAECggEAQ+C5VJETeg2rjNObTQe9waBdjjMu6RuAAL+Xni2jvQTe
D/LzFXHDi+y0ZQMQYLoNE6ku8cYtt7wLGi+Fo0LNnkvP7CjNkWwDK0BSueeJvggU
mMY2z/7mCONJU963WvJKkeI2ayIsICg+wGlaC8vEyt3AmwexmhFzXKI67rraWSwe
U4tkToD05dkKW4XVbRLTr4f69EAdp7MSHIrUbk7fykQth7VzaonZkaqc2Qg91gSB
3WFPjrBBr6rYeXSIFUd61IPVQeUQkVNS2L16w3aUBNDt+PNuvMHS4k1bJwF+OMec
1hluEgdEWCSXE5sO5SZG50CtTs6EZu7pfwSNMlfWiQKBgQDRNapdTB8UuFjeF59n
+YJD8Ail9CcmGwAJe3IUT2kHsh0aVt25dULx9NsMxNqW0qH/MVbavqm/vEoAbewO
U9xq55Aqkexrd67Tqe8bll+418zFAGHeDl2ahX5zv2LB0a9tm5ijagWQQhhUqcv5
iPD5eSzkciqLvzxSofEWEm4RLwKBgQDGJuUytIgailDWSjOdiOOSLU0n2x48wGdP
HCj/Es7Quskc5wJUAZ4UtylbYTozTOAjeqZXMFkBJZNXG0poutcLIQskTeelkEj9
NjWHdfYBfUk3KtohcFlyNZuO/YHFa0NeYDpmCPVSnxDktXR0fVSFgnvDJUNJsuYo
/WLl7Q5P5QKBgFTmlnCuR569ATOAGqyzUO4JJzlRz+Fi66ztb+pWH6WD3tOllO2C
bNyMJakU6jBy4lMRztGOtoyc+NsbwMQ/vB+WQadE+NDUDRrQx7xGVipJSUxZT14y
LkJbEmoerRFC6xJsJpGKoR9d80nIboKh1Ekpp9I9ko6L2QsftRrj9875AoGAH7LR
L49ZxoUh8WXlY+omHZhJo3qWF7nfzPQASu3DT/jRe2IpKS8pDr9OSmP/X32IzaQt
P/1n/5r3OxQOjzp0dD9Q/PnJeN7gDkHBxm3EcPCN6dldE8RZSr/wpqs/O0mxeUOD
lBcSx6jSlwPAIXJ7NvBsxAcOAJgx4ZTHYWjOxVECgYAZrVqLaRGwTsaiiLv4Htlp
ATA5STN8LTlyNj8qSsl8ZdR2AbEwAjaelVH5MKZjcBvKETWQ8Cin3eIYsG7ZKfNI
cf+WfM6lEGuk1j+OSadnq1VOVVOKfbhaXmdEe/4MENxG9r7SXoMSfp4gu6ZvCQM+
1w1jurNrYWZsNPsb96ddpg==
-----END PRIVATE KEY-----"
```

## How to Set Environment Variables in Render

1. Go to your Render dashboard
2. Select your CVision API service
3. Go to "Environment" tab
4. Add each environment variable above
5. For the private key, make sure to:
   - Include the quotes
   - Include the `\n` characters for line breaks
   - Or paste it exactly as shown above

## Testing After Deployment

Once deployed, your app should show:
```
🔥 Firebase Admin initialized successfully from environment variables
```

Instead of:
```
🔥 Loading Firebase configuration from firebase.json
```

This confirms it's using the environment variables correctly on Render.
