"""Independent, bounded offline specifications. Standard library only; no network I/O."""
import bisect
import collections
import copy
import itertools
import math
import random

def subsets(n):
    return (list(c) for size in range(n+1) for c in itertools.combinations(range(n),size))

def inorder(node):
    return [] if node is None else inorder(node['left'])+[node['value']]+inorder(node['right'])

def bst(values):
    root=None
    for value in values:
        if root is None:root={'value':value,'left':None,'right':None};continue
        current=root
        while current['value']!=value:
            side='left' if value<current['value'] else 'right'
            if current[side] is None:
                current[side]={'value':value,'left':None,'right':None};break
            current=current[side]
    return root

def height(node):
    return 0 if node is None else 1+max(height(node['left']),height(node['right']))

def delete(root,value):
    root=copy.deepcopy(root);holder={'root':root};parent=holder;side='root';current=root
    while current is not None and current['value']!=value:
        parent=current;side='left' if value<current['value'] else 'right';current=current[side]
    if current is None:return root
    if current['left'] is not None and current['right'] is not None:
        above=current;link='right';successor=current['right']
        while successor['left'] is not None:above=successor;link='left';successor=successor['left']
        current['value']=successor['value'];above[link]=successor['right']
    else:parent[side]=current['left'] or current['right']
    return holder['root']

def avl(values):
    def rotate(node,direction):
        other='right' if direction=='left' else 'left'
        top=node[other];node[other]=top[direction];top[direction]=node
        return top
    def insert(node,value):
        if node is None:return {'value':value,'left':None,'right':None}
        if value==node['value']:return node
        side='left' if value<node['value'] else 'right';node[side]=insert(node[side],value)
        difference=height(node['left'])-height(node['right'])
        if difference>1:
            child=node['left']
            if height(child['left'])<height(child['right']):node['left']=rotate(child,'left')
            node=rotate(node,'right')
        elif difference < -1:
            child=node['right']
            if height(child['right'])<height(child['left']):node['right']=rotate(child,'right')
            node=rotate(node,'left')
        return node
    root=None
    for value in values:root=insert(root,value)
    return root

def paths(root):
    result={};stack=[(root,[])]
    while stack:
        node,path=stack.pop()
        if node is not None:
            current=path+[node['value']];result[node['value']]=current
            stack.extend((node[side],current) for side in ('left','right'))
    return result

def groups(n,edges,removed=()):
    vertices=set(range(n))-set(removed);adj={v:set() for v in vertices}
    for a,b in edges:
        if a in vertices and b in vertices:adj[a].add(b);adj[b].add(a)
    out=[]
    while vertices:
        found={min(vertices)};todo=list(found)
        for v in todo:
            for w in adj[v]-found:found.add(w);todo.append(w)
        vertices-=found;out.append(sorted(found))
    return sorted(out)

def closure(n,edges):
    reach=[[False]*n for _ in range(n)]
    for a,b in edges:reach[a][b]=True
    for k in range(n):
        for a in range(n):
            for b in range(n):reach[a][b]|=reach[a][k] and reach[k][b]
    return reach

def cyclic(n,edges):
    matrix=closure(n,edges)
    return any(matrix[v][v] for v in range(n))

def components(n,edges):
    reach=closure(n,edges);left=set(range(n));out=[]
    while left:
        v=min(left);part={w for w in left if w==v or reach[v][w] and reach[w][v]}
        out.append(sorted(part));left-=part
    return sorted(out)

def distances(n,edges,start):
    distance=[math.inf]*n;distance[start]=0
    for _ in range(n-1):
        old=list(distance)
        for a,b,w in edges:distance[b]=min(distance[b],old[a]+w)
    if any(distance[a]+w<distance[b] for a,b,w in edges):return None
    return [None if x==math.inf else x for x in distance]

def forest(n,edges):
    count=len(groups(n,[(a,b) for a,b,w in edges]));best=math.inf
    for selected in itertools.combinations(edges,n-count):
        if len(groups(n,[(a,b) for a,b,w in selected]))==count:best=min(best,sum(w for a,b,w in selected))
    return 0 if best==math.inf else best

def cut_value(n,edges,source,sink):
    middle=[v for v in range(n) if v not in (source,sink)];cuts=[]
    for positions in subsets(len(middle)):
        chosen={source,*[middle[i] for i in positions]}
        cost=sum(c for a,b,c in edges if a in chosen and b not in chosen)
        cuts.append((cost,chosen))
    best=min(c for c,s in cuts)
    return best,sorted(set.intersection(*(s for c,s in cuts if c==best)))

def pairing(left_count,right_count,edges):
    available=set(map(tuple,edges));candidates=[]
    def enumerate_pairs(a,used,result):
        if a==left_count:candidates.append(list(result));return
        enumerate_pairs(a+1,used,result)
        for b in range(right_count):
            if (a,b) in available and b not in used:enumerate_pairs(a+1,used|{b},result+[[a,b]])
    enumerate_pairs(0,set(),[])
    return min(candidates,key=lambda result:(-len(result),result))

def tree_graph(root):
    weights=[];edges=[]
    def collect(node,parent=None):
        if node is None:return
        current=len(weights);weights.append(node['value'])
        if parent is not None:edges.append((parent,current))
        collect(node['left'],current);collect(node['right'],current)
    collect(root)
    return weights,edges

def independent_indices(items,nondecreasing=False):
    legal=[s for s in subsets(len(items)) if all(items[a]<=items[b] if nondecreasing else items[a]<items[b] for a,b in zip(s,s[1:]))]
    return min(legal,key=lambda s:(-len(s),tuple(reversed(s))))

def subsequence(a,b):
    iterator=iter(b)
    return all(any(x==y for y in iterator) for x in a)

def chain_choices(dims,left,right):
    if left==right:return [(0,'A'+str(left))]
    return [(a+b+dims[left]*dims[k+1]*dims[right+1],'('+x+'*'+y+')')
            for k in range(left,right) for a,x in chain_choices(dims,left,k) for b,y in chain_choices(dims,k+1,right)]

def tours(costs):
    n=len(costs)
    if n==0:return (0,[])
    if n==1:return (0,[0,0])
    choices=[]
    for order in itertools.permutations(range(1,n)):
        route=[0,*order,0];weights=[costs[a][b] for a,b in zip(route,route[1:])]
        if all(w is not None for w in weights):choices.append((sum(weights),route))
    return min(choices,default=(-1,[]))

def hull(points):
    points=sorted(set(map(tuple,points)))
    if len(points)<=1:return [list(p) for p in points]
    def cross(a,b,c):return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
    current=points[0];out=[]
    while True:
        out.append(list(current));candidate=next(p for p in points if p!=current)
        for point in points:
            turn=cross(current,candidate,point)
            farther=sum((point[i]-current[i])**2 for i in (0,1))>sum((candidate[i]-current[i])**2 for i in (0,1))
            if turn<0 or turn==0 and farther:candidate=point
        current=candidate
        if current==points[0]:return out

def oracle(group,i,args):
    a=args[0];check=group=='check';mixed=group=='transfer'
    if i==66:
        if mixed:return list(dict.fromkeys(a))
        pivot=args[1]
        return [[x for x in a if x<pivot],[x for x in a if x==pivot],[x for x in a if x>pivot]] if check else [[x for x in a if x<pivot],[x for x in a if x>=pivot]]
    if i==67:return sum(a) if mixed else a*a if check else a*(a+1)//2
    if i==68:return a*(a-1)//2 if mixed else 2*a-1 if check else a*a.bit_length()
    if i==69:
        if mixed:
            result=[];pops=0
            for x in a:
                removed=next((j for j,v in enumerate(result) if v>x),len(result));pops+=len(result)-removed;result=result[:removed]+[x]
            return [result,len(a)+pops]
        capacity=1 if a<=1 else 1<<(a-1).bit_length()
        return [1<<p for p in range(capacity.bit_length()-1)] if check else [a+capacity-1,capacity]
    if i==70:return max(0,a-1) if mixed else (a-1).bit_length() if check else (math.factorial(a)-1).bit_length()
    if i==71:return [[v,c] for v,c in sorted(collections.Counter(a).items())] if mixed else sorted(a)
    if i==72:return sorted(a) if not check else sorted(a,key=lambda x:(x//args[1])%10)
    if i==73:return sorted(a)[(len(a)-1)//2] if mixed else sorted(a)[-args[1]] if check else sorted(a)[args[1]]
    if i==74:return sorted(a,key=lambda row:(row[0],row[1])) if mixed else sorted(a,key=lambda row:row[0],reverse=check)
    if i==99:
        if check:
            out=list(a);random.Random(args[1]).shuffle(out);return out
        return sorted(a)[(len(a)-1)*args[1]//100 if mixed else args[1]]
    if i==75:
        if mixed:return [v for v in inorder(a) if not args[1]<=v<=args[2]]
        for value in args[1] if check else [args[1]]:a=delete(a,value)
        return a
    if i==76:
        if mixed:
            values=inorder(a)
            def balanced(node):return node is None or abs(height(node['left'])-height(node['right']))<=1 and balanced(node['left']) and balanced(node['right'])
            return values==sorted(set(values)) and balanced(a)
        tree=avl(a)
        return height(tree) if check else tree
    if i==77:
        values=inorder(a)
        if mixed:return [values[k] if 0<=k<len(values) else None for k in args[1]]
        return bisect.bisect_left(values,args[1]) if check else values[args[1]] if 0<=args[1]<len(values) else None
    if i==78:
        table=paths(a)
        if mixed:
            targets=args[1]
            if not targets or any(t not in table for t in targets):return None
            common=list(itertools.takewhile(lambda row:len(set(row))==1,zip(*(table[t] for t in targets))))
            return common[-1][0]
        x,y=args[1:]
        if x not in table or y not in table:return -1 if check else None
        common=list(itertools.takewhile(lambda pair:pair[0]==pair[1],zip(table[x],table[y])))
        return len(table[x])+len(table[y])-2*len(common) if check else common[-1][0]
    if i==79:
        values=list(a);out=[]
        for op in args[1]:
            if op[0]=='set':values[op[1]]=op[2]
            elif mixed:out.append(next((j for j in range(len(values)) if sum(values[:j+1])>=op[1]),-1))
            else:out.append(min(values[op[1]:op[2]+1]) if check else sum(values[op[1]:op[2]+1]))
        return out
    if i==80:
        edges=args[1]
        if mixed:
            reach=closure(a,edges);start=args[2]
            return any((v==start or reach[start][v]) and reach[v][v] for v in range(a))
        if check:return min(len(s) for s in subsets(len(edges)) if not cyclic(a,[e for j,e in enumerate(edges) if j not in s]))
        return cyclic(a,edges)
    if i==81:
        parts=components(a,args[1])
        if not check and not mixed:return parts
        owner={v:j for j,g in enumerate(parts) for v in g};inc=set();out=set()
        for x,y in args[1]:
            if owner[x]!=owner[y]:inc.add(owner[y]);out.add(owner[x])
        return (0 if len(parts)<=1 else max(len(parts)-len(inc),len(parts)-len(out))) if mixed else len(parts)-len(inc)
    if i==82:
        edges=args[1];original=len(groups(a,edges))
        fragile=[j for j in range(len(edges)) if len(groups(a,edges[:j]+edges[j+1:]))>original]
        if mixed:return [len(groups(a,edges[:j]+edges[j+1:])) for j in args[2]]
        return groups(a,[e for j,e in enumerate(edges) if j not in fragile]) if check else fragile
    if i==83:
        counts=[len(groups(a,args[1],[v])) for v in range(a)]
        return min(range(a),key=lambda v:(counts[v],v)) if mixed else counts if check else [v for v,c in enumerate(counts) if c>len(groups(a,args[1]))]
    if i==84:
        n=len(a) if mixed else a;edges=args[1]
        plain=edges if mixed or check else [(x,y) for x,y,w in edges]
        if cyclic(n,plain):return -1 if mixed or check else []
        if mixed:
            def finish(v):return a[v]+max((finish(x) for x,y in edges if y==v),default=0)
            return max(map(finish,range(n)),default=0)
        start=args[2];graph=collections.defaultdict(list)
        for edge in edges:graph[edge[0]].append(edge[1:])
        if check:
            goal=args[3]
            def count(v):return int(v==goal)+sum(count(row[0]) for row in graph[v])
            return count(start)
        answers=[None]*n
        def enumerate_paths(v,cost):
            answers[v]=cost if answers[v] is None else max(answers[v],cost)
            for w,weight in graph[v]:enumerate_paths(w,cost+weight)
        enumerate_paths(start,0);return answers
    if i==85:
        matrix=[]
        for start in range(a):
            row=distances(a,args[1],start)
            if row is None:return []
            matrix.append(row)
        if mixed:return [matrix[x][y] is not None and matrix[x][y]<=budget for x,y,budget in args[2]]
        if check:return -1 if any(x is None for row in matrix for x in row) else max((x for row in matrix for x in row),default=0)
        return matrix
    if i==86:
        edges=args[1]+([[x,y,0] for x,y in args[2]] if mixed else [])
        if not check and len(groups(a,[(x,y) for x,y,w in edges]))>1:return -1
        return forest(a,edges)
    if i==87:
        if mixed:
            quotas,jobs,allowed=args;workers=len(quotas);source=workers+jobs;sink=source+1
            edges=[[source,w,q] for w,q in enumerate(quotas)]+[[w,workers+j,1] for w,j in set(map(tuple,allowed))]+[[workers+j,sink,1] for j in range(jobs)]
            return cut_value(sink+1,edges,source,sink)[0]
        value,side=cut_value(*args)
        return side if check else value
    if i==88:
        size=len(pairing(*args))
        if check:return pairing(*args)
        return [v for v in range(a) if len(pairing(a,args[1],[[x,y] for x,y in args[2] if x!=v]))==size] if mixed else size
    if i==89:
        if mixed:
            from functools import lru_cache
            @lru_cache(None)
            def insert(text):
                if len(text)<2:return 0
                return insert(text[1:-1]) if text[0]==text[-1] else 1+min(insert(text[1:]),insert(text[:-1]))
            return insert(a)
        if len(a)<2:return '' if check else 0
        best=min(chain_choices(a,0,len(a)-2))
        return best[1] if check else best[0]
    if i==90:
        weights,edges=tree_graph(a);candidates=[]
        for chosen in subsets(len(weights)):
            group_set=set(chosen)
            if mixed:
                if all(v in group_set or any((x==v and y in group_set) or (y==v and x in group_set) for x,y in edges) for v in range(len(weights))):candidates.append(len(chosen))
            elif check:
                if all(x in group_set or y in group_set for x,y in edges):candidates.append(sum(weights[v] for v in chosen))
            elif all(not (x in group_set and y in group_set) for x,y in edges):candidates.append(sum(weights[v] for v in chosen))
        return min(candidates) if mixed or check else max(candidates)
    if i==91:
        if mixed:return min((sum(row[j] for row,j in zip(a,order)) for order in itertools.permutations(range(len(a)))),default=0)
        value,route=tours(a);return route if check else value
    if i==92:
        path=independent_indices(a,mixed)
        return [a[j] for j in path] if check else path
    if i==93:
        if mixed:return max((j-i for i in range(len(a)) for j in range(i+1,len(a)+1) if max(a[i:j])-min(a[i:j])<=args[1]),default=0)
        k=args[1]
        return [] if not 0<k<=len(a) else [(min if check else max)(a[j:j+k]) for j in range(len(a)-k+1)]
    if i==94:
        if not a:return 0
        active=[sum(start<=x<end for start,end in a) for x in range(min(x for x,y in a),max(y for x,y in a))]
        return max(active,default=0) if check else sum(v>=args[1] for v in active) if mixed else sum(v>0 for v in active)
    if i==95:
        blocked=set(map(tuple,args[1])) if mixed else set()
        placements=[list(order) for order in itertools.permutations(range(a)) if len({r-c for r,c in enumerate(order)})==a and len({r+c for r,c in enumerate(order)})==a and all((r,c) not in blocked for r,c in enumerate(order))]
        return min(placements,default=[]) if check else len(placements)
    if i==96:
        if mixed:
            value,mult,add,steps,mod=args
            for _ in range(steps):value=(value*mult+add)%mod
            return value%mod
        return sum(pow(a,j,args[2]) for j in range(args[1]))%args[2] if check else pow(*args)
    if i==97:
        if mixed:return sum(prime(a[x]+a[y]) for x in range(len(a)) for y in range(x+1,len(a)))
        if check:return [0 if v<2 else next(p for p in range(2,v+1) if v%p==0) for v in range(a+1)]
        return [v for v in range(2,a+1) if prime(v)]
    if i==98:
        k=args[1]
        if check:
            values=list(itertools.combinations(range(a),k));return list(values[args[2]]) if args[2]<len(values) else []
        if mixed:return sum(all(y-x>1 for x,y in zip(s,s[1:])) for s in itertools.combinations(range(a),k))%args[2] if 0<=k<=a else 0
        return math.comb(a,k)%args[2] if 0<=k<=a else 0
    if i==100:
        valid=[s for s in subsets(a) if all(x in s or y in s for x,y in args[1])]
        if check:
            chosen=args[2];return len(set(chosen))==len(chosen) and all(0<=v<a for v in chosen) and all(x in chosen or y in chosen for x,y in args[1])
        smallest=min(valid,key=lambda s:(len(s),s));return a-len(smallest) if mixed else smallest
    if i==101:
        if mixed:return min(sum(a[v] for v in s) for s in subsets(len(a)) if all(x in s or y in s for x,y in args[1]))
        chosen=set()
        for x,y in args[1]:
            if x not in chosen and y not in chosen:chosen|={x,y}
        if check:
            for v in sorted(chosen,reverse=True):
                trial=chosen-{v}
                if all(x in trial or y in trial for x,y in args[1]):chosen=trial
        return sorted(chosen)
    if i==102:
        valid=[s for s in subsets(len(a)) if all(a[x][1]<=a[y][0] or a[y][1]<=a[x][0] for x,y in itertools.combinations(s,2)) and (not mixed or len(s)<=args[1])]
        best=min(valid,key=lambda s:(-sum(a[j][2] for j in s),s));return best if check else sum(a[j][2] for j in best)
    if i==103:
        def score(x,y):return max((len(s) for positions in subsets(len(x)) if subsequence(s:=''.join(x[j] for j in positions),y)),default=0)
        if mixed:
            if not args[1]:return []
            values=[score(a,c) for c in args[1]];index=max(range(len(values)),key=lambda j:values[j]);return [values[index],index]
        return max((j-k for k in range(len(a)+1) for j in range(k,len(a)+1) if a[k:j] in args[1]),default=0) if check else score(*args)
    if i==104:
        if mixed:
            if not a or not a[0]:return 0
            rows,cols=len(a),len(a[0]);edges=[]
            for r in range(rows):
                for c in range(cols):
                    edges.extend([r*cols+c,x*cols+y,a[x][y]] for x,y in ((r-1,c),(r+1,c),(r,c-1),(r,c+1)) if 0<=x<rows and 0<=y<cols)
            return distances(rows*cols,edges,0)[-1]
        edges=([edge for x,y in args[1] for edge in ([x,y,0],[y,x,1])] if check else args[1]);values=distances(a,edges,args[2])
        return (-1 if values[args[3]] is None else values[args[3]]) if check else values
    if i==105:
        if mixed:
            x,m,y,n=args;return next(v for v in range(m*n) if v%m==x%m and v%n==y%n)
        return sum(a*x%args[2]==args[1]%args[2] for x in range(args[2])) if check else next((x for x in range(args[1]) if a*x%args[1]==1),None)
    if i==106:
        if mixed:return max(((x-u)**2+(y-v)**2 for x,y in a for u,v in a),default=0)
        if check:
            point=args[1]
            if len(a)<3:
                if not a:return False
                if len(a)==1:return a[0]==point
                return area(a[0],a[1],point)==0 and all(min(a[0][d],a[1][d])<=point[d]<=max(a[0][d],a[1][d]) for d in (0,1))
            return any(abs(area(a[0],a[j],a[j+1]))==abs(area(point,a[0],a[j]))+abs(area(point,a[j],a[j+1]))+abs(area(point,a[j+1],a[0])) for j in range(1,len(a)-1))
        return hull(a)
    if i==107:
        if mixed:
            k=args[1]
            if not 0<k<=len(a):return []
            return sorted(word for word,count in collections.Counter(a[j:j+k] for j in range(len(a)-k+1)).items() if count>=2)
        return [j for j in range(len(a)+1) if a.startswith(args[1],j)] if check else a.find(args[1])
    raise AssertionError((group,i,args))

def prime(n):return n>=2 and all(n%p for p in range(2,math.isqrt(n)+1))
def area(a,b,c):return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])

def generated(group,i,rng):
    check=group=='check';mixed=group=='transfer'
    a=[rng.randrange(-5,6) for _ in range(rng.randrange(8))]
    text=lambda: ''.join(rng.choices('abAB',k=rng.randrange(7)))
    root=bst(rng.sample(range(-8,9),rng.randrange(7)))
    n=rng.randrange(6)
    edges=[[rng.randrange(n),rng.randrange(n)] for _ in range(rng.randrange(7))] if n else []
    intervals=[sorted([rng.randrange(-4,7),rng.randrange(-4,7)]) for _ in range(rng.randrange(6))]
    if i==66:return [a] if mixed else [a,rng.randrange(-4,5)]
    if i==67:return [[abs(x) for x in a]] if mixed else [rng.randrange(31)]
    if i==68:return [rng.randrange(31)] if mixed else [1<<rng.randrange(11)]
    if i==69:return [a] if mixed else [rng.randrange(80)]
    if i==70:return [rng.randrange(30)] if mixed else [rng.randrange(1,100000)] if check else [rng.randrange(13)]
    if i==71:return [[rng.randrange(51) if not check else rng.randrange(-20,21) for _ in a]]
    if i==72:
        if mixed:
            width=rng.randrange(4)
            return [[''.join(rng.choices('abc',k=width)) for _ in a]]
        values=[rng.randrange(10000) for _ in a]
        return [values,10**rng.randrange(4)] if check else [values]
    if i==73:
        values=a or [rng.randrange(-5,6)]
        return [values] if mixed else [values,rng.randrange(1,len(values)+1) if check else rng.randrange(len(values))]
    if i==74:
        return [[[rng.randrange(4),rng.randrange(4),'id'+str(j)] if mixed else [rng.randrange(4),'id'+str(j)] for j in range(len(a))]]
    if i==75:
        if mixed:
            low,high=sorted([rng.randrange(-9,10),rng.randrange(-9,10)])
            return [root,low,high]
        return [root,a] if check else [root,rng.randrange(-9,10)]
    if i==76:
        if mixed:
            if root is not None and rng.randrange(2):root['value']=-root['value']
            return [root]
        return [a]
    if i==77:return [root,a] if mixed else [root,rng.randrange(-9,10)]
    if i==78:return [root,a[:3]] if mixed else [root,rng.randrange(-8,9),rng.randrange(-8,9)]
    if i==79:
        values=[abs(x) for x in a] if mixed else a
        operations=[]
        for _ in range(rng.randrange(7)):
            if values and rng.randrange(2):operations.append(['set',rng.randrange(len(values)),rng.randrange(8) if mixed else rng.randrange(-5,6)])
            elif mixed:operations.append(['first',rng.randrange(1,16)])
            elif values:
                left,right=sorted([rng.randrange(len(values)),rng.randrange(len(values))]);operations.append(['min' if check else 'sum',left,right])
        return [values,operations]
    if i==80:
        if mixed:
            n=max(1,n);edges=[[rng.randrange(n),rng.randrange(n)] for _ in range(rng.randrange(7))]
            return [n,edges,rng.randrange(n)]
        return [n,edges]
    if i in (81,82,83):
        if i==81 and mixed:
            n=rng.randrange(5);edges=[[rng.randrange(n),rng.randrange(n)] for _ in range(rng.randrange(7))] if n else []
        if i==83 and mixed and n==0:n=1
        return [n,edges,[rng.randrange(len(edges)) for _ in range(rng.randrange(5))] if edges else []] if i==82 and mixed else [n,edges]
    if i==84:
        n=max(1,n) if not mixed else n
        plain=[[rng.randrange(n),rng.randrange(n)] for _ in range(rng.randrange(7))] if n else []
        if rng.randrange(2):plain=[[x,y] for x,y in plain if x<y]
        if mixed:return [[rng.randrange(8) for _ in range(n)],plain]
        start=rng.randrange(n)
        return [n,plain,start,rng.randrange(n)] if check else [n,[[x,y,rng.randrange(-4,6)] for x,y in plain],start]
    if i==85:
        weighted=[[x,y,rng.randrange(6) if check or mixed else rng.randrange(-3,6)] for x,y in edges]
        requests=[[rng.randrange(n),rng.randrange(n),rng.randrange(10)] for _ in range(rng.randrange(5))] if n else []
        return [n,weighted,requests] if mixed else [n,weighted]
    if i==86:return [n,[[x,y,rng.randrange(7) if mixed else rng.randrange(-3,7)] for x,y in edges],edges[:2]] if mixed else [n,[[x,y,rng.randrange(-3,7)] for x,y in edges]]
    if i==87:
        if mixed:
            workers,jobs=rng.randrange(4),rng.randrange(4)
            allowed=[[rng.randrange(workers),rng.randrange(jobs)] for _ in range(rng.randrange(8))] if workers and jobs else []
            return [[rng.randrange(3) for _ in range(workers)],jobs,allowed]
        n=rng.randrange(2,6)
        return [n,[[rng.randrange(n),rng.randrange(n),rng.randrange(5)] for _ in range(rng.randrange(8))],0,n-1]
    if i==88:
        left,right=rng.randrange(5),rng.randrange(5)
        return [left,right,[[rng.randrange(left),rng.randrange(right)] for _ in range(rng.randrange(8))] if left and right else []]
    if i==89:return [text()] if mixed else [[rng.randrange(1,9) for _ in range(rng.randrange(6))]]
    if i==90:
        if check:
            def positive(node):
                if node is not None:node['value']=abs(node['value']);positive(node['left']);positive(node['right'])
            positive(root)
        return [root]
    if i==91:
        n=rng.randrange(6)
        matrix=[[rng.randrange(-3,8) if mixed else 0 if x==y else None if rng.randrange(4)==0 else rng.randrange(8) for y in range(n)] for x in range(n)]
        return [matrix]
    if i==92:return [a]
    if i==93:return [a,rng.randrange(8) if mixed else rng.randrange(-1,10)]
    if i==94:return [intervals,rng.randrange(1,5)] if mixed else [intervals]
    if i==95:
        n=rng.randrange(8)
        blocked=[[rng.randrange(n),rng.randrange(n)] for _ in range(rng.randrange(5))] if n else []
        return [n,blocked] if mixed else [n]
    if i==96:return [rng.randrange(-5,6),rng.randrange(-3,4),rng.randrange(-3,4),rng.randrange(16),rng.randrange(1,16)] if mixed else [rng.randrange(-4,5),rng.randrange(21),rng.randrange(1,16)]
    if i==97:return [[abs(x) for x in a]] if mixed else [rng.randrange(81)]
    if i==98:
        n=rng.randrange(9)
        k=rng.randrange(n+1) if check else rng.randrange(-1,n+2)
        return [n,k,rng.randrange(math.comb(n,k)+2)] if check else [n,k,rng.randrange(1,17)]
    if i==99:
        values=a or [0]
        if check:return [a,rng.randrange(100)]
        return [values,rng.randrange(101) if mixed else rng.randrange(len(values)),rng.randrange(100)]
    if i==100:return [n,edges,rng.choices(range(-1,n+1),k=rng.randrange(5))] if check else [n,edges]
    if i==101:
        if not mixed:edges=[[x,y] for x,y in edges if x!=y]
        return [[rng.randrange(9) for _ in range(n)],edges] if mixed else [n,edges]
    if i==102:
        jobs=[[start,end+1,rng.randrange(-3,10)] for start,end in intervals]
        return [jobs,rng.randrange(5)] if mixed else [jobs]
    if i==103:return [text(),[text() for _ in range(rng.randrange(5))]] if mixed else [text(),text()]
    if i==104:
        if mixed:
            rows,cols=rng.randrange(4),rng.randrange(4)
            return [[[rng.randrange(2) for _ in range(cols)] for _ in range(rows)]]
        n=max(1,n);plain=[[rng.randrange(n),rng.randrange(n)] for _ in range(rng.randrange(7))]
        return [n,plain,rng.randrange(n),rng.randrange(n)] if check else [n,[[x,y,rng.randrange(2)] for x,y in plain],rng.randrange(n)]
    if i==105:
        if mixed:
            m,n=rng.choice([(2,3),(3,4),(3,5),(4,5),(5,7)])
            return [rng.randrange(-9,10),m,rng.randrange(-9,10),n]
        return [rng.randrange(-9,10),rng.randrange(-9,10),rng.randrange(2,20)] if check else [rng.randrange(-9,10),rng.randrange(2,20)]
    if i==106:
        points=[[rng.randrange(-3,4),rng.randrange(-3,4)] for _ in a]
        return [hull(points),[rng.randrange(-4,5),rng.randrange(-4,5)]] if check else [points]
    if i==107:return [text(),rng.randrange(-1,9)] if mixed else [text(),text()]
    raise AssertionError((group,i))
