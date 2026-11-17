package main
import ("bytes";"encoding/json";"strings";"testing")

const sha="0123456789abcdef0123456789abcdef01234567"
func good() Trace {return Trace{Schema:"osd-observation-trace/v1",SourceSHA:sha,Seed:42,Frames:[]Frame{{Tick:1,Match:"case",Mode:"arcade",Ships:[]Ship{{ID:"a",X:10,Y:20,Energy:50,Health:95}}},{Tick:2,Match:"case",Mode:"arcade",Ships:[]Ship{{ID:"a",X:11,Y:20,Energy:48,Health:95}}}}}}
func has(r Report,code string)bool{for _,v:=range r.Findings{if v.Code==code{return true}};return false}
func TestPass(t *testing.T){r:=check(good());if r.Verdict!="PASS_CONTRACT_ONLY"||len(r.Findings)!=0 {t.Fatalf("%+v",r)}}
func TestFalsifiers(t *testing.T){
 tests:=[]struct{name,code string;mutate func(*Trace)}{
 {"schema","BAD_SCHEMA",func(x *Trace){x.Schema="future"}},
 {"source","NO_SOURCE_ID",func(x *Trace){x.SourceSHA="not-a-sha"}},
 {"empty","NO_FRAMES",func(x *Trace){x.Frames=nil}},
 {"tick","NON_MONOTONIC_TICK",func(x *Trace){x.Frames[1].Tick=1}},
 {"match","MATCH_CHANGED",func(x *Trace){x.Frames[1].Match="other"}},
 {"missing-match","MISSING_MATCH",func(x *Trace){x.Frames[0].Match=""}},
 {"mode","INVALID_MODE",func(x *Trace){x.Frames[0].Mode="glide"}},
 {"mode-changed","MODE_CHANGED",func(x *Trace){x.Frames[1].Mode="inertial"}},
 {"duplicate","DUPLICATE_SHIP",func(x *Trace){x.Frames[0].Ships=append(x.Frames[0].Ships,x.Frames[0].Ships[0])}},
 {"energy-low","ENERGY_OUT_OF_RANGE",func(x *Trace){x.Frames[0].Ships[0].Energy=-1}},
 {"energy-high","ENERGY_OUT_OF_RANGE",func(x *Trace){x.Frames[0].Ships[0].Energy=101}},
 {"health-low","HEALTH_OUT_OF_RANGE",func(x *Trace){x.Frames[0].Ships[0].Health=-1}},
 {"health-high","HEALTH_OUT_OF_RANGE",func(x *Trace){x.Frames[0].Ships[0].Health=101}},
 {"empty-id","DUPLICATE_SHIP",func(x *Trace){x.Frames[0].Ships[0].ID=""}},
 }
 for _,tc:=range tests{t.Run(tc.name,func(t *testing.T){x:=good();tc.mutate(&x);r:=check(x);if !has(r,tc.code)||r.Verdict!="FAIL" {t.Fatalf("%s %v",tc.code,r)}})}
}
func TestWarning(t *testing.T){x:=good();x.Frames[0].Ships=nil;r:=check(x);if r.Verdict!="PASS_CONTRACT_ONLY"||!has(r,"NO_SHIPS"){t.Fatal(r)}}
func TestSerialization(t *testing.T){x:=good();b,_:=json.Marshal(x);var out bytes.Buffer;if err:=run(bytes.NewReader(b),&out);err!=nil {t.Fatal(err)};if !strings.Contains(out.String(),"PASS_CONTRACT_ONLY"){t.Fatal(out.String())}}
func TestRejectBadJSON(t *testing.T){var out bytes.Buffer;if err:=run(strings.NewReader("{"),&out);err==nil{t.Fatal("accepted bad JSON")}}
func TestRejectLargeInput(t *testing.T){var out bytes.Buffer;if err:=run(strings.NewReader(strings.Repeat(" ",2<<20+10)),&out);err==nil{t.Fatal("accepted giant input")}}
func TestRejectedExit(t *testing.T){x:=good();x.Frames[0].Ships[0].Energy=-1;b,_:=json.Marshal(x);var out bytes.Buffer;if err:=run(bytes.NewReader(b),&out);err==nil{t.Fatal("rejected trace returned nil")};if !strings.Contains(out.String(),"ENERGY_OUT_OF_RANGE"){t.Fatal(out.String())}}
