// Real local VLM smoke on original synthetic image only.
// This never accesses private Open Space Duel sources or external model APIs.
package main
import (
 "bytes"
 "context"
 "crypto/sha256"
 "encoding/base64"
 "encoding/hex"
 "encoding/json"
 "fmt"
 "image"
 "image/color"
 "image/png"
 "net/http"
 "os"
 "strings"
 "time"
)
type modelList struct {Data []struct{ID string `json:"id"`} `json:"data"`}
type completion struct {Choices []struct {Message struct{Content string `json:"content"`} `json:"message"`} `json:"choices"`;Usage any `json:"usage"`}
func main(){
 output:=os.Getenv("OSD_RDTE_OUTPUT");if output==""{output="osd-vlm-evidence"}
 if err:=os.MkdirAll(output,0700);err!=nil {panic(err)}
 report:=map[string]any{"schema":"osd-vlm-smoke/v1","classification":"NOT_RUN","model_family":"SmolVLM2-256M-Video-Instruct","stimulus":"original synthetic red square on blue field","not_proven":"OSD UI quality, game reasoning, P2P, or any physical device capability","time_utc":time.Now().UTC().Format(time.RFC3339)}
 save:=func(){b,_:=json.MarshalIndent(report,"","  ");_ = os.WriteFile(output+"/receipt.json",append(b,'\n'),0600)}
 defer save()
 img:=image.NewRGBA(image.Rect(0,0,128,128))
 for y:=0;y<128;y++{for x:=0;x<128;x++{
  c:=color.RGBA{0,25,180,255}
  if x>=32&&x<96&&y>=32&&y<96 {c=color.RGBA{235,12,12,255}}
  img.Set(x,y,c)
 }}
 var buf bytes.Buffer
 if err:=png.Encode(&buf,img);err!=nil{report["classification"]="HARNESS_FAILURE";report["error"]=err.Error();os.Exit(0)}
 stimulusHash:=sha256.Sum256(buf.Bytes());report["stimulus_sha256"]=hex.EncodeToString(stimulusHash[:])
 _=os.WriteFile(output+"/synthetic.png",buf.Bytes(),0600)
 ctx,cancel:=context.WithTimeout(context.Background(),110*time.Second);defer cancel()
 client:=&http.Client{Timeout:100*time.Second}
 req,err:=http.NewRequestWithContext(ctx,"GET","http://127.0.0.1:8080/v1/models",nil)
 if err!=nil{panic(err)}
 rsp,err:=client.Do(req)
 if err!=nil{report["classification"]="MODEL_UNREACHABLE";report["error"]=err.Error();return}
 var models modelList
 if rsp.StatusCode!=200 {report["classification"]="MODEL_NOT_READY";report["status"]=rsp.StatusCode;_ =rsp.Body.Close();return}
 err=json.NewDecoder(rsp.Body).Decode(&models);_ =rsp.Body.Close()
 if err!=nil||len(models.Data)==0{report["classification"]="MODEL_DISCOVERY_FAILURE";return}
 modelID:=models.Data[0].ID;report["model_id"]=modelID
 dataURL:="data:image/png;base64,"+base64.StdEncoding.EncodeToString(buf.Bytes())
 body:=map[string]any{
  "model":modelID,
  "messages":[]any{map[string]any{"role":"user","content":[]any{
   map[string]any{"type":"text","text":"Describe the main center square color using one of red, green, blue, or unknown. Respond with exactly one word."},
   map[string]any{"type":"image_url","image_url":map[string]any{"url":dataURL}},
  }}},
  "max_tokens":30,"temperature":0.0,"stream":false,
 }
 raw,_:=json.Marshal(body)
 request,err:=http.NewRequestWithContext(ctx,"POST","http://127.0.0.1:8080/v1/chat/completions",bytes.NewReader(raw));if err!=nil{panic(err)}
 request.Header.Set("Content-Type","application/json")
 start:=time.Now()
 response,err:=client.Do(request)
 report["latency_ms"]=time.Since(start).Milliseconds()
 if err!=nil{report["classification"]="INFERENCE_ERROR";report["error"]=err.Error();return}
 defer response.Body.Close()
 report["http_status"]=response.StatusCode
 if response.StatusCode!=200{report["classification"]="INFERENCE_HTTP_FAILURE";var e bytes.Buffer;_,_=e.ReadFrom(response.Body);report["error_excerpt"]=e.String()[:min(1000,len(e.String()))];return}
 var result completion
 if err=json.NewDecoder(response.Body).Decode(&result);err!=nil{report["classification"]="RESPONSE_PARSE_FAILURE";report["error"]=err.Error();return}
 if len(result.Choices)==0{report["classification"]="EMPTY_COMPLETION";return}
 answer:=strings.TrimSpace(strings.ToLower(result.Choices[0].Message.Content));report["answer"]=answer
 report["usage"]=result.Usage
 if strings.Trim(answer," .!\n")=="red"{report["classification"]="SUPPORTED_SYNTHETIC_VISUAL_ONLY"}else {report["classification"]="ORACLE_FAILURE"}
}
