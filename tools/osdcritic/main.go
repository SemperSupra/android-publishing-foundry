// osdcritic checks a public synthetic/game-observation trace with deterministic invariants.
// It is a critic contract work sample, not a production Open Space Duel state adapter.
package main

import (
 "encoding/json"
 "errors"
 "fmt"
 "io"
 "math"
 "os"
 "sort"
)

type Ship struct {
 ID string `json:"id"`
 X float64 `json:"x"`
 Y float64 `json:"y"`
 Energy float64 `json:"energy"`
 Health float64 `json:"health"`
}
type Frame struct {
 Tick int64 `json:"tick"`
 Match string `json:"match"`
 Mode string `json:"mode"`
 Ships []Ship `json:"ships"`
}
type Trace struct {
 Schema string `json:"schema"`
 SourceSHA string `json:"source_sha"`
 Seed int64 `json:"seed"`
 Frames []Frame `json:"frames"`
}
type Finding struct {
 Code string `json:"code"`
 Severity string `json:"severity"`
 Frame int `json:"frame"`
 Evidence string `json:"evidence"`
}
type Report struct {
 Schema string `json:"schema"`
 Verdict string `json:"verdict"`
 SourceSHA string `json:"source_sha"`
 Findings []Finding `json:"findings"`
 FramesChecked int `json:"frames_checked"`
 Limits []string `json:"limits"`
}
func check(t Trace) Report {
 r:=Report{Schema:"osd-critic-report/v1",SourceSHA:t.SourceSHA,Findings:[]Finding{},FramesChecked:len(t.Frames),
 Limits:[]string{"Synthetic semantic trace only; not a real browser/gameplay physics, P2P, UI, accessibility or VLM qualification."}}
 add:=func(code,severity string,i int,e string){r.Findings=append(r.Findings,Finding{code,severity,i,e})}
 if t.Schema!="osd-observation-trace/v1" {add("BAD_SCHEMA","block",0,"unsupported trace schema")}
 if len(t.SourceSHA)!=40 {add("NO_SOURCE_ID","block",0,"source SHA must be 40 hex characters")} else {for _,c:=range t.SourceSHA {if !((c>='0'&&c<='9')||(c>='a'&&c<='f')) {add("NO_SOURCE_ID","block",0,"source SHA must be lowercase hexadecimal");break}}}
 if len(t.Frames)==0 {add("NO_FRAMES","block",0,"no observations")}
 var last int64=-1
 var match,mode string
 for i,f:=range t.Frames {
  if f.Tick<=last {add("NON_MONOTONIC_TICK","block",i,fmt.Sprintf("tick=%d previous=%d",f.Tick,last))}
  last=f.Tick
  if f.Match=="" {add("MISSING_MATCH","block",i,"empty match identity")}
  if f.Mode!="arcade"&&f.Mode!="inertial" {add("INVALID_MODE","block",i,"unsupported flight mode")}
  if i==0 {match,mode=f.Match,f.Mode} else {
   if match!=f.Match {add("MATCH_CHANGED","block",i,"match identity changed mid-trace")}
   if mode!=f.Mode {add("MODE_CHANGED","block",i,"flight mode changed mid-trace")}
  }
  if len(f.Ships)==0 {add("NO_SHIPS","warning",i,"frame has no ship observations")}
  seen:=map[string]bool{}
  for _,s:=range f.Ships {
   if s.ID==""||seen[s.ID] {add("DUPLICATE_SHIP","block",i,"empty/duplicate ship identity")} 
   seen[s.ID]=true
   for _,v:=range []struct{name string;value float64}{{"x",s.X},{"y",s.Y},{"energy",s.Energy},{"health",s.Health}} {
    if math.IsNaN(v.value)||math.IsInf(v.value,0) {add("NONFINITE","block",i,s.ID+"."+v.name)}
   }
   if s.Energy<0||s.Energy>100 {add("ENERGY_OUT_OF_RANGE","block",i,fmt.Sprintf("%s=%g",s.ID,s.Energy))}
   if s.Health<0||s.Health>100 {add("HEALTH_OUT_OF_RANGE","block",i,fmt.Sprintf("%s=%g",s.ID,s.Health))}
  }
 }
 sort.SliceStable(r.Findings,func(i,j int)bool {
  a,b:=r.Findings[i],r.Findings[j];if a.Frame!=b.Frame{return a.Frame<b.Frame};return a.Code<b.Code
 })
 r.Verdict="PASS_CONTRACT_ONLY"
 for _,f:=range r.Findings {if f.Severity=="block" {r.Verdict="FAIL";break}}
 return r
}
func run(input io.Reader,output io.Writer) error {
 b,err:=io.ReadAll(io.LimitReader(input,2<<20+1));if err!=nil{return err};if len(b)>2<<20{return errors.New("trace exceeds 2 MiB")}
 var t Trace
 if err:=json.Unmarshal(b,&t);err!=nil{return fmt.Errorf("invalid JSON: %w",err)}
 r:=check(t)
 e:=json.NewEncoder(output);e.SetIndent("","  ");if err:=e.Encode(r);err!=nil{return err}
 if r.Verdict=="FAIL" {return errors.New("deterministic critic rejected trace")}
 return nil
}
func main(){if len(os.Args)!=2 {fmt.Fprintln(os.Stderr,"usage: osdcritic /path/to/trace.json");os.Exit(2)}
 f,err:=os.Open(os.Args[1]);if err!=nil {fmt.Fprintln(os.Stderr,err);os.Exit(2)};defer f.Close()
 if err=run(f,os.Stdout);err!=nil{fmt.Fprintln(os.Stderr,err);os.Exit(1)}
}
